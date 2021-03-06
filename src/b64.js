const { TRAILING_ONES, LEADING_ONES, initDict, htmlCodeVars } = require('./utils');
const { fromUtf8Str, toUtf8Str } = require('./utf8');

const hasSymbol = typeof Symbol === 'function';

const B64_ERROR_TYPE = hasSymbol ? Symbol('b64') : 0xB64;
//`Symbol()` creates a unique symbol, unlike `Symbol.for()`

const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

const B64_LOOKUP = {};
B64_CHARS.forEach((char, idx) => B64_LOOKUP[char] = idx);


const concatInPlace = (arr1, arr2) => {
  arr2.forEach(el => arr1[arr1.length] = el);
};

const throwB64Error = e => {
  e.$$typeof = B64_ERROR_TYPE;

  throw e;
};


const toB64 = byteString => {
  const dict = initDict();

  let b64 = '';

  while (byteString.length) {
    const bytes = byteString.slice(0, 3);
    byteString = byteString.slice(3);

    if (dict[bytes]) {
      b64 +=  dict[bytes];
    } else {
      let result = '';

      const octets = bytes.split('').map(ch => ch.codePointAt());

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

      sextets.forEach(sextet => result += sextet === -1 ? '=' : B64_CHARS[sextet]);

      dict[bytes] = result;
      b64 += result;
    }
  }

  return b64;
};


const fromB64 = b64 => {
  const dict = initDict();

  b64 = b64.replace(/\s+/g, '');

  let byteString = '';

  while (b64[b64.length - 1] === '=') {
    b64 = b64.slice(0, b64.length - 1);
  }

  const remainder = b64.length % 4;

  while (b64.length) {
    const b64Slice = b64.slice(0, 4);

    b64 = b64.slice(4);

    if (dict[b64Slice]) {
      byteString +=  dict[b64Slice];
    } else {
      const sextets = b64Slice.split('').map((char, idx) => {
        const val = B64_LOOKUP[char];

        if (typeof val === 'undefined') {
          throw new RangeError(htmlCodeVars`Invalid Base64 character ${char} at index ${idx}`);
        }

        return val;
      });

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

      const result = octets.map(octet => String.fromCharCode(octet)).join('');

      dict[b64Slice] = result;
      byteString += result;
    }
  }

  if (remainder && (byteString[byteString.length - 1] === '\0')) byteString = byteString.slice(0, byteString.length - 1);

  return byteString;
};


const utf8Encode = str => {
  try {
    return toB64(toUtf8Str(str));
  } catch(e) {
    throwB64Error(e);
  }
};


const utf8Decode = b64 => {
  try {
    return fromUtf8Str(fromB64(b64));
  } catch(e) {
    throwB64Error(e);
  }
};


module.exports = { utf8Encode, utf8Decode, B64_ERROR_TYPE };
