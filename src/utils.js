const TRAILING_ONES = new Array(9).fill().map((_el, idx) => Math.pow(2, idx) - 1);
// [ 0b0, 0b1, ... 0b11111111 ]
const LEADING_ONES = TRAILING_ONES.map((el, idx) => el << (8 - idx));
// [ 0b0, 0b10000000, ... 0b11111111 ]


const ESCAPE_SEQUENCES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};


const htmlCodeVars = (strs, ...vals) => {
  return strs.reduce((out, curr, idx) => {
    out += curr;
    const val = vals[idx];
    if (typeof val !== 'undefined') {
      out += '<code>';
      out += String(val).replace(/[&<>]/g, m => ESCAPE_SEQUENCES[m]);
      out += '</code>';
    }

    return out;
  }, '');
};


const initDict = () => {
  const dict = {};
  dict.__proto__ = null;

  return dict;
};

module.exports = { TRAILING_ONES, LEADING_ONES, initDict, htmlCodeVars };
