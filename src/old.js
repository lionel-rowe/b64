const b64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

const ranges = [
  {bytes: 1, min: 0x0000, max: 0x007f, mask: '0xxxxxxx'},
  {bytes: 2, min: 0x0080, max: 0x07ff, mask: '110xxxxx10xxxxxx'},
  {bytes: 3, min: 0x0800, max: 0xffff, mask: '1110xxxx10xxxxxx10xxxxxx'},
  {bytes: 4, min: 0x10000, max: 0x10ffff, mask: '11110xxx10xxxxxx10xxxxxx10xxxxxx'}
];

// https://github.com/facebook/react/blob/8482cbe22d1a421b73db602e1f470c632b09f693/packages/shared/ReactSymbols.js#L14-L16

const B64_ERROR_TYPE = 0xB64;

const throwError = (type, msg, data) => {
  const self = { type };

  const error = new self.type(msg || undefined);
  if (data) error.data = data;

  error.$$typeof = B64_ERROR_TYPE;

  throw error;
};

function toUtf8Bin(char) {

  if (!char || typeof char !== 'string' || Array.from(char).length !== 1) {
    throwError(RangeError, null, { 'Invalid UTF-8 character': char });
  };

  const codepoint = char.codePointAt();
  let mask;

  ranges.forEach(range => {
    if (codepoint >= range.min && codepoint <= range.max) {
      mask = range.mask.split('');
    }
  });

  if (!mask) {
    throwError(RangeError, null, {'Invalid codepoint': codepoint});
  } else {

    let contentBits = mask.filter(el => el === 'x').length;

    const codepointBin = codepoint.toString(2).padStart(contentBits, '0');

    let cursor = 0;
    const bin = mask.map(el => {

      let newEl;

      if (el === 'x') {
        newEl = codepointBin[cursor];
        cursor++;
      }

      return newEl || el;
    }).join('');

    if (cursor !== codepointBin.length) {
      throwError(RangeError, 'Mask length error', {char: char, codepoint: codepoint, expected: codepointBin, actual: cursor});
    } else {
      return bin;
    }
  }
}

function toB64(str) {

  const bin = Array.from(str)
    .map(char => toUtf8Bin(char))
    .join('')
    .split(/(.{6})/)
    .filter(el => el);

  const lastBin = bin[bin.length - 1];
  const equalses = lastBin ? '='.repeat((6 - lastBin.length) / 2) : '';
  if (lastBin) {
    bin[bin.length - 1] = lastBin.padEnd(6, '0');
  }

  const result = bin.map(el => b64Chars[parseInt(el, 2)]).join('') + equalses;

  return result;

}

function fromUtf8Bin(bin) {

  const bytes = bin.length / 8;

  if ([1,2,3,4].indexOf(bytes) < 0) {
    throwError(RangeError, null, {'Incorrect number of bytes': bytes})
  }

  const mask = ranges.filter(range => range.bytes === bytes)[0].mask;

  let codepointBin = '';

  bin.split('').forEach((bit, idx) => {
    if (mask[idx] === 'x') {
      codepointBin += bit;
    }
  });

  const codepoint = parseInt(codepointBin, 2)

  return String.fromCodePoint(codepoint);
}

function fromB64(b64) {

  if (b64.length % 4 === 1) {
    throwError(RangeError, 'Invalid length for a b64 string');
  }

  const invalids = b64.replace(/=+$/, '').split('').filter(char => (b64Chars).indexOf(char) < 0);

  if (invalids.length) {
    throwError(RangeError, null, {'Invalid base64 characters': invalids.join('')});
  }

  let bin = b64.replace(/=+$/, '').split('').map(el => b64Chars.indexOf(el).toString(2).padStart(6, '0')).join('');

  const bytes = bin.split(/(.{8})/).filter(el => el.length === 8);

  const mod = bin.length % 24;

  if ([0, 12, 18].indexOf(mod) === -1) {
    throwError(RangeError, 'Incorrect number of bits in b64 representation');
  }

  const chars = [];

  for (let i = 0; i < bytes.length; i++) {
    if (/^0/.test(bytes[i])) {
      chars.push(fromUtf8Bin(bytes[i]));
    } else if (/^110/.test(bytes[i])) {
      chars.push(fromUtf8Bin(bytes.slice(i, i + 2).join('')));
      i += 1;
    } else if (/^1110/.test(bytes[i])) {
      chars.push(fromUtf8Bin(bytes.slice(i, i + 3).join('')));
      i += 2;
    } else if (/^11110/.test(bytes[i])) {
      chars.push(fromUtf8Bin(bytes.slice(i, i + 4).join('')));
      i += 3;
    } else {
      throwError(RangeError, null, {'Invalid UTF-8 character': `0x${parseInt(bytes[i], 2).toString(16).toUpperCase()}`});
    }
  }

  return chars.join('');
}

module.exports = { B64_ERROR_TYPE, fromB64, toB64, fromUtf8Bin, toUtf8Bin };
