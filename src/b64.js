const B64_ERROR_TYPE = 0xB64;

// const p = (...n) => console.log(...n);
// const pBin = n => console.log(n.toString(2));


const TRAILING_ONES = new Array(9).fill().map((_el, idx) => Math.pow(2, idx) - 1);
// [ 0b0, 0b1, ... 0b11111111 ]
const LEADING_ONES = TRAILING_ONES.map((el, idx) => el << (8 - idx));
// [ 0b0, 0b10000000, ... 0b11111111 ]


const RULES = [ // https://en.wikipedia.org/wiki/UTF-8#Description
  {
    range: [ 0x0000, 0x007f ],
    pattern: [ [ 0b0, 7, 0] ]
  }, {
    range: [ 0x0080, 0x07ff ],
    pattern: [ [ 0b110, 5, 6 ], [ 0b10, 6, 0 ] ]
  }, {
    range: [ 0x0800, 0xffff ],
    pattern: [ [ 0b1110, 4, 12 ], [ 0b10, 6, 6 ], [ 0b10, 6, 0 ] ]
  }, {
    range: [ 0x10000, 0x10ffff ],
    pattern: [ [ 0b11110, 3, 18 ], [ 0b10, 6, 12 ], [ 0b10, 6, 6 ], [ 0b10, 6, 0 ] ]
  }
];


const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

const B64_LOOKUP = {};
B64_CHARS.forEach((char, idx) => B64_LOOKUP[char] = idx);


const concatInPlace = (arr1, arr2) => {
  arr2.forEach(el => arr1[arr1.length] = el);
  // Array.prototype.push.apply(arr1, arr2);
};

const throwError = (type, msg) => {
  const self = { type };

  const error = new self.type(msg || undefined);

  error.$$typeof = B64_ERROR_TYPE;

  throw error;
};


const findRule = codepoint => {
  return RULES.find(rule => codepoint >= rule.range[0] && codepoint <= rule.range[1]);
};


const toUtf8Bin = char => {
  if (!char || typeof char !== 'string' || Array.from(char).length !== 1) {
    throwError(RangeError, `Invalid character: \`${char}\``);
  }

  const codepoint = char.codePointAt();

  const rule = findRule(codepoint);
  if (!rule) throwError(RangeError, `Invalid Unicode codepoint: \`0x${codepoint.toString(16)}\``);

  const pattern = rule.pattern;
  const len = pattern.length;

  const bytes = pattern.map(([ header, dataLength, offsetRight ]) => {
    const headerShifted = header << dataLength;
    const codepointShifted = (codepoint >> offsetRight) & TRAILING_ONES[dataLength];

    return headerShifted | codepointShifted;
  });

  return bytes;
};


const toUtf8Arr = str => {
  const out = [];

  Array.from(str).forEach(char => concatInPlace(out, toUtf8Bin(char)));

  return out;
};


const fromUtf8Arr = utf8Arr => {
  const outStrArr = [];

  const len = utf8Arr.length;

  let trailingByteCounter = -1;
  let rule, header, dataLength, outCodePoint;

  utf8Arr.forEach((byte, idx) => {
    if (trailingByteCounter < 0) {
      outCodePoint = 0;

      rule = RULES.find((rule) => {
        [ header, dataLength ] = rule.pattern[0];

        trailingByteCounter = rule.pattern.length - 1;

        return (header << dataLength & LEADING_ONES[8 - dataLength]) === (byte & LEADING_ONES[8 - dataLength]);
      });

      if (!rule) throwError(RangeError, `Invalid UTF-8 byte at index \`${idx}\``);
    }

    [ header, dataLength, offsetRight ] = rule.pattern[rule.pattern.length - trailingByteCounter - 1];

    if ((header << dataLength & LEADING_ONES[8 - dataLength]) !== (byte & LEADING_ONES[8 - dataLength])) {
      throwError(RangeError, `Invalid UTF-8 byte at index \`${i}\``);
    }

    const outBits = byte & TRAILING_ONES[dataLength];

    outCodePoint |= outBits << offsetRight;

    if (trailingByteCounter === 0) {
      outStrArr[outStrArr.length] = String.fromCodePoint(outCodePoint);
    }

    trailingByteCounter--;
  });

  return outStrArr.join('');
};


// const tests = [
//   { char: '\ufeff', want: [239, 187, 191],      is: toUtf8Bin('\ufeff') },
//   { char: '💩',     want: [240, 159, 146, 169], is: toUtf8Bin('💩') },
//   { char: ' ',      want: [32],                 is: toUtf8Bin(' ') },
//   { char: '~',      want: [126],                is: toUtf8Bin('~') },
//   { char: '\xa0',   want: [194, 160],           is: toUtf8Bin('\xa0') },
//   { char: 'ÿ',      want: [195, 191],           is: toUtf8Bin('ÿ') },
//   { char: '一',     want: [228, 184, 128],      is: toUtf8Bin('一') },
//   { char: '鿕',     want: [233, 191, 149],      is: toUtf8Bin('鿕') },
//   { char: '鑫',     want: [233, 145, 171],      is: toUtf8Bin('鑫') },
//   { char: '😀',     want: [240, 159, 152, 128], is: toUtf8Bin('😀') },
//   { char: '🙏',     want: [240, 159, 153, 143], is: toUtf8Bin('🙏') },
//   { char: '𝔘',      want: [240, 157, 148, 152], is: toUtf8Bin('𝔘') },
//   { char: 'Á',      want: [195, 129],           is: toUtf8Bin('Á') },
//   { char: 'λ',      want: [206, 187],           is: toUtf8Bin('λ') },
//   { char: '\0',     want: [0],                  is: toUtf8Bin('\0') }
// ];

// let passed = [], failed = [];

// tests.forEach(el => {

//   const { want, is, char } = el;

//   // const want = JSON.stringify([...new TextEncoder().encode(char)]);

//   // const is = JSON.stringify(toUtf8Bin(char));

//   trg = JSON.stringify(want) === JSON.stringify(is) ? passed : failed;

//   trg[trg.length] = { char, want, is };

// });

// // p('passed: ', passed, 'failed: ', failed)

// // p(passed.reduce((acc, el) => acc.concat(el.is), []));

// const testStr = '\ufeff💩 ~\xa0ÿ一鿕鑫😀🙏𝔘Áλ\0';

// p(
// fromUtf8Arr(toUtf8Arr(testStr))
// );


const toB64 = bytes => {
  const b64 = [];

  while (bytes.length) {
    const octets = bytes.splice(0, 3);

    const sextets = [];

    sextets[0] = octets[0] >> 2;

    sextets[1] = (octets[0] & TRAILING_ONES[2]) << 4;

    if (typeof octets[1] !== 'undefined') {
      sextets[1] |= octets[1] >> 4;
      sextets[2] = (octets[1] & TRAILING_ONES[4]) << 2;
    } else sextets[2] = -1;

    if (typeof octets[2] !== 'undefined') {
      sextets[2] |= octets[2] >> 6;
      sextets[3] = octets[2] & TRAILING_ONES[6];
    } else sextets[3] = -1;

    sextets.forEach(sextet => b64[b64.length] = sextet === -1 ? '=' : B64_CHARS[sextet]);
  }

  return b64.join('');
};


const toUtf8B64 = str => {
  return toB64(toUtf8Arr(str));
};


const fromB64 = b64 => {
  const bytes = [];

  while (b64[b64.length - 1] === '=') {
    b64 = b64.slice(0, b64.length - 1);
  }

  const remainder = b64.length % 4;

  const b64Bin = b64.split('').map((char, idx) => {
    const val = B64_LOOKUP[char];

    if (typeof val === 'undefined') {
      throwError(RangeError, `Invalid Base64 character: ${char} at index: ${idx}`);
    }

    return val;

  });

  while (b64Bin.length) {
    const sextets = b64Bin.splice(0, 4);
    const octets = [];

    octets[octets.length] = sextets[0] << 2;

    if (typeof sextets[1] !== 'undefined') {
      octets[0] |= sextets[1] >> 4;
      octets[octets.length] = (sextets[1] & TRAILING_ONES[4]) << 4;
    }

    if (typeof sextets[2] !== 'undefined') {
      octets[1] |= sextets[2] >> 2;
      octets[octets.length] = (sextets[2] & TRAILING_ONES[2]) << 6;
    }

    if (typeof sextets[3] !== 'undefined') {
      octets[2] |= sextets[3];
    }

    concatInPlace(bytes, octets);
  }

  if (remainder && (bytes[bytes.length - 1] === 0)) bytes.pop();

  return bytes;
};


const fromUtf8B64 = b64 => {
  return fromUtf8Arr(fromB64(b64));
};


// const getRStr = () => {

//   const r = Math.floor(Math.random() * 100);

//   return new Array(r).fill().map(_ => {
//     const min = 0;
//     const max = '~'.codePointAt();

//     const rCP = Math.floor(Math.random() * (max + 1 - min)) + min;

//     return String.fromCodePoint(rCP);
//   }).join('');
// };

// const a = btoa(rStr);

// const b = toUtf8B64(rStr);

// const g = [], f = [];

// for (let i = 0; i < 100; i++) {

//   const rStr = getRStr();
//   const native = btoa(rStr);
//   const reconverted = fromUtf8B64(native);

//   const o = { rStr, native, reconverted };

//   if (reconverted === rStr) {
//     g[g.length] = o
//   } else {
//     f[f.length] = o
//   }


// }

// p('Passed: ', g, 'Failed: ', f);


// p(toUtf8B64('\ufeff💩 ~\xa0ÿ一鿕鑫😀🙏𝔘Áλ\0'))
// 77u/8J+SqSB+wqDDv+S4gOm/lemRq/CfmIDwn5mP8J2UmMOBzrsA

module.exports = { B64_ERROR_TYPE, fromUtf8Arr, toUtf8Arr, fromUtf8B64, toUtf8B64 };
