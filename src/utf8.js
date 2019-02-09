const { TRAILING_ONES, LEADING_ONES, initDict } = require('./ones');


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


const findRule = codepoint => {
  return RULES.find(rule => codepoint >= rule.range[0] && codepoint <= rule.range[1]);
};


const toUtf8Bin = char => {
  if (!char || typeof char !== 'string' || Array.from(char).length !== 1) {
    throw new RangeError(htmlCodeVars`Invalid character ${char}`);
  }

  const codepoint = char.codePointAt();

  const rule = findRule(codepoint);
  if (!rule) throw new RangeError(htmlCodeVars`Invalid Unicode codepoint 0x${codepoint.toString(16)}`);

  const pattern = rule.pattern;
  const len = pattern.length;

  const bytes = pattern.map(([ header, dataLength, offsetRight ]) => {
    const headerShifted = header << dataLength;
    const codepointShifted = (codepoint >> offsetRight) & TRAILING_ONES[dataLength];

    return headerShifted | codepointShifted;
  });

  // return bytes;
  return bytes.map(b => String.fromCodePoint(b)).join('');

};


const toUtf8Str = nativeStr => {
  const dict = initDict();

  const out = [];

  // Array.from(nativeStr).forEach(char => concatInPlace(out, toUtf8Bin(char)));
  return Array.from(nativeStr).map(char => {
    if (dict[char]) {
      return dict[char];
    } else {
      const result = toUtf8Bin(char);
      dict[char] = result;
      return result;
    }
  }).join('');

  // return out;
};


const fromUtf8Str = utf8Arr => {// ~!!!!!!!!!!!!!!!!!!!
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

      if (!rule) throw new RangeError(htmlCodeVars`Invalid UTF-8 byte at index ${idx}`);
    }

    [ header, dataLength, offsetRight ] = rule.pattern[rule.pattern.length - trailingByteCounter - 1];

    if ((header << dataLength & LEADING_ONES[8 - dataLength]) !== (byte & LEADING_ONES[8 - dataLength])) {
      throw new RangeError(htmlCodeVars`Invalid UTF-8 byte at index ${i}`);
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

module.exports = { fromUtf8Str, toUtf8Str };
