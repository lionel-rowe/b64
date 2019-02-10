const { utf8Encode, utf8Decode, B64_ERROR_TYPE } = require('../src/b64');

const tests = require('./tests.json');

tests.forEach((t, i) => {
  test(`encode [${i}] : "${t.src.slice(0, 20)}..."`, () => {
    expect(utf8Encode(t.src)).toBe(t.trg.replace(/\s/g, ''));
  });

  test(`decode [${i}] : "${t.trg.slice(0, 20)}..."`, () => {
    expect(utf8Decode(t.trg)).toBe(t.src);
  });
})
