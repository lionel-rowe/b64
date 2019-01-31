const { toUtf8Bin, toB64, fromUtf8Bin, fromB64 } = require('./b64');

// function randBetween(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function randString(minLen, maxLen, maxSetIdx) {
//   const len = randBetween(minLen, maxLen);
//   const arr = [];

//   const sets = [
//     [' ', '~'],
//     ['\u00a0', 'ÿ'],
//     ['一', '鿕'],
//     ['😀', '🙏']
//   ];

//   for (let i = 0; i < len; i++) {

//     const set = randBetween(0, maxSetIdx);
//     const codepoint = randBetween(sets[set][0].codePointAt(), sets[set][1].codePointAt());

//     arr.push(String.fromCodePoint(codepoint));
//   }

//   return arr.join('');
// }

// const miscToB64Tests = new Array(100).fill(0).map(el => randString(0, 100, 0));

// const miscReconversionTests = new Array(100).fill(0).map(el => randString(0, 100, 3));

// const miscFromB64Tests = ["OmIyOjR0TFVWLGVJe3QwcjleYDE+cUtfb0RkfkhCRl1WZXZdemh6SVMocCIjbUg+OEJoWkg9bV9bNGAjKHJIbCB4dVtccHx5Mns3MX5YanRFLg==","Xm96Lm1qJ3AjJF5eTChse0BlKilxLSlBaTwxKERNLC1pOUlTbDNyam1tMVli","fmNuVDZwP3F9KShLeXlabmVmNiskXmkheX4mR1VoSS1fKGZQMWtmYjIodH18cEBdPXF8M0JzOjtsZlF0QzhUNDgjSmxsUU1paU1ibjNLdWx7PmVJSnoqdHJsalc=","O3FBUn1eZQ==","Oi5oUzp9fUc9SHJ6IDNDJ34jNUFVSDdUQnNpcHRdIW9fbGFpSEp3","KDcvbXt0fWM+TnR0Ujx8fiFkTCVGbXdMSi1bSjx4L1hJbzBMWn4jQXY7Ol9xWTk0cnx8QmsyRzlbe1lFKXFQJCIy","a1ZAJDN0ZDpXVmBFMEpxNHl0L24rM315cGhaM3RXY3xLSUB3M1k8VEkuTScrOW8pc1EoeGc=","QXNnQj4=","QFdGRiNURUclPFRXMDZeYVtxP3k7TS9WXl43OzFGKWBpX0JNWTRXSEhvRTxiJSloO3lWOlMhbj5SXGJPXSpfMGJoVWVZXEA=","djlXXGYhYj5UL24zUiYoZUBtTXZlVWA2b14wcSRnLWVMZVFbdUt7PXlySnhpT0QxbGYpNUhwJTlyISN1UXhJKltIdi8=","QG9feEE=","fSRnWnFFKXlqTjpGQiAnPUJ2XkZDbDUhZyZbfmlAcWk4SkJLIVdHRXN2P241LXNFIVQ4Vj9wQE1AeC93aS1OXVsiT35vXCBYJzppJFY=","NSAvPiZgJ215cWUvTF9RRnkweEEofTRMP0NqQT4zR3RjdTFw","bEJMb20iTnxaMy0hICVpfntTImMuJDgobT0rMU4tei1FLmZXVUgxP0R5NVQkI3wkKi1GYy4mL2A0TVBMNVdreFYnSEBHRDg=","a11cPmc3a2olIk1nMVY+fSFbPDRxJ1pjZWg=","c0VZJCI4MGwucERtSzZgMz8wbEguSDZHVnF8K0Vreyd1cVhZSTM7XmtoczEgRmc2KWo0NShCNWFnczEt","UlpDNSo3XXciWHlrRiV4XWBbeSgjWTtfTG1CU2Q/JnskLD9EPzV+L3s7UnhgOiY3M1l4bno/QS8ra0pkUktEVS92eSU2bDt9WG1jTCsofEt1RW4pJUEwXHpPXFF7LyhpanM=","OiJlMGwkLEcgcCo1YUl9eT45In5uU1QiPU96anNkSmo2cg==","THMlfSBaPip2NHI0M0k7bSE4UkZJIyVZYj5BKU59LyN2Nl1VdyJLckt9dFtRXm59IVRLcWggKUxweiNPJnBpMjhQQTUtTixvT0o0a3AlfVBEbW9JOSdkMld1","InBYVmtzWC5GVVEjOVVhfWZWS1ZEVHVWZCVjU1R3Zy4mMTw8a3J3TyteTWlaRSVNIw==","NGZdJFA2WkwrTGNdU1ZeNXk9MEMmR3U8WHk/VjZIamY1UW5KJTNUX0ZPVUJ0emNaMiVMK3FaOj4kXg==","WXMlLkwndzhKLHV6OiA6b3tAWSZ5SUk=","K2RNSGoyJE1sIFZ4KlhdYU15YHUgJ3VGPipCUC12UlhJc2phPiRYIVhWJ05dLXg/KnQyT3t1Mk9aTnozWnk+U1h6JTNFZTpYLyxuZkw=","VnFGQlp2RzlVK15qWXdKcCdrcDV3blF9W0I+QHd8","ZkFOIl1pLzJYMlp1W3wjT0pKX3xzPDw8M0RQIzEzdzx7d14oX2QkUGo+RSdzRlEjIGkveH5Zcy1JVEkuSCklKi9gKzc7YlAlJCYncDVBdi07fUxvNydhaHc=","UCMnQTRGY0UjWn16OX1pXSAifUplVmYwel87SVJ5YExQZS1nLWA3ZlNDRz9GUzM8S34+WEI=","Uk81dXF4IUVtdmZuZTk7QXNKVEl4TTs+TE47P1hIIThRTjJOclhtcjM9eA==","fVNfU2BpVVA8IF0kTidLR1Vraj0yLkV8PUY5V0JGcyQhWixMbg==","YnVDW1RsTGQsLUBc","YjxXZnZ0RVw/LVoxWjUsaiBgInUlaDFnfmw2LEUyZUgoT2M2WXY=","MXt7c1dxXF4gVjFmem1KeiZkNU42Xy11dHh0YmFlNyd+NkspfEY1fVRpJUxOPA==","Z1I5SSdBRixHMnNUNVFBSXZdXSprIis6dnNrbX1we0ckJTk7dGx8Q3RkfFVWS0NSUVx7JzQoTm1qOjRAOGd5aX50Wlpra2JLe3J5Q11HRGtfRTZVUXt5fkpiTyNuPnlK","IyJOel0zNDZudnR4KUV7aT10TFJdKQ==","eT9qOzxIQnhESmg5W3Q/dncwVHEzQGxzRVFqPEdzYVMkeG1naX1JfC9DIjxNQVE7XCl8RkUwdWIvZWRkICRaTGIzaFwhaTwhIW5sWiNiSnB1OyVzW0lSR3VDQi9FZSN7KjpBPw==","YnFcPDUsT3RJQWVUPXMhWnN4Pko=","Lk4uPXgyT3xqSDlHL1QuVUguMF9kezFmI0Y=","SH16fStSRFBVIHNQOi9uUCYudUhad04zOHwgTlxVQTU3eUw1bGUmXTVxJUBUWkwrSn5WOTNme19BdjI9bnBZeURRVUg1WjFJQDZiWGhqMHN9aHIkKylXWSRDcjYvfHpoPjdOLg==","ZWE7Vl4/SUBcX0FnNmBOPGZyeVhMajZcNzhSTSI9fk11WWV3fixWenNjX3VCS35gVjgmN0EzZkEsMUwpI3onbnkhQ1hc","VSw1QzxQJjN+OVJASis=","WmhiRjRkXjtYIC91Og==","bURrIl0=","OU9vKmp9Zl8/JkE1","dSA1Q2pTfXZdMVA8fCVfO3E1bDcvPDRoQjNJT2V1TWFJPTcnaE5saVEhPnU6PGtGb2lM","Jlk=","IypsSFMpLnh2PFRFYA==","Km1QdEM=","UWBQLEVHemRDX3VYeF9WKSMuXWRqJjdi","Jy5gIUp6MzlGZSYxWw==","MSxoejlZaCE1UU9afVZDWyVhQVp7RGwwOkdQWkc1QT5ae3kkPDVAPnVjSDk=","fFsyQV4kVnxBJFopKmknaj9EYG5CSXxMSUZTZSw0TlxNUm1fZmhbO0diT30oJVZ6MjBQck5uZFh0Z2VuaiNFdSNYODE5aFMgbF5kS1xPbTo=","YEFTcGs1YyZjUiozXTo3eWpbUllVJ15WTU9qX189QyApRGhHVlJv","U0k=","SkZIOj49bSl0KmIzOEpQUTt8PGwoXj5vZkkxaCUnI0VuZFonY259RzZFXCpjdU5UYT4le3IkSl1FVUc7NmZxTTtqamJgeV9XVzh5cEJzeCk1d0RLSEglZEY/Ig==","aWNCdGA4fSM2WkwoMTssZ1NuVSd7MSt2MUY8Xmk3Oig+MF88fGpRdSpATDtoWCQmR2ojVmJBYWgnK0Z9VCJMQ2c=","aDRhJQ==","ImEtZ0BkdGpPeTVLaUJzOVJWVUNIMU1udg==","Kz0wUV5tdjQ3ejBMeWltRFdGPSw8JTA8eF85ajVNUyx9X2w9TV9zYng1e0U1dSR3WXdNTFxiKA==","RkcqaitIJCMnVk15Vyp5VyFGMDl2VC5ccmgjKlAgNGVULShcWk4kOUp4WyJuYTBkRUBPLC1jR3tRUFs8dzI9Ojh2PDpwOVZjQ3lHPUgi","","KS5cZz1FY2whdyA3Zid4cFFZODllSVNKZmt8PnlGNH5eQkoiWDVKYFhxVVUpNkkqU0IxJCMyPHU2RFdVaVtIJ04uMjwhflJdXVsq","UDRbOyNyM1ZJL3xER2M=","KyFwNyZCQmNRTWIsSGA7Mzc=","Vkd1WEF6RUVSRiNGNno3XGxqIClyVjl8Jg==","THRiLjwmPDJhd3d6aElxWDIsKldFazt6dFk1PHFibSM/XWsxRzIsYDdJZ0FR","dzN9THYlKio0WD9WLVFZWDRFajJ3MUBNRlp2RS8oPXs7MGMtKCdrbTI+eygpOVVacCYl","P31WamdZMCRAcV5tOitFa1VgKlZkP1RccVhqemx9diE=","X199b30iPF8mPjkscGxpMVJyLzt6bDp5S1xxfT19M05zcVxfJj9hLn1bUj5TdVYmJnVudzxcfDFePXk/dytEKTk=","KSpiekVRX25+RzxSQg==","X052KSFpRCgvYz1IJVw3IzVBXC9mYXpSXWJLREdocjpwIWFPKkIyY1pkXW49RENBbV9U","SltFXWhMIS5zKUA=","OkYpYz1uIT0+XkVBdXBbRTNxWkZMJkRvUicib1N0OnwwUkcybyB6NSw=","bTgmdkhJeixXTFlCPkBXVTBxfixNdzUqPFNubjxJfSw6XXAwZTIpK2cuJ0hpSCZSZVZcN08gZUktQFJlU20vaD1pZCB2OEQgIFElWH1B","NXMgTSg9O3hvViB+Z1NmIlwzM1xrMiw+KCV5SnA1dGl6T3J8LD8sUShzUH02","OGpCJWQwdGR6KF87cylUXi1kWG52QVtqIXl5S2tjOlE1ekY3LnArazo5NmE5WnBzVlF5RGtMeGxIdTp1Lj9kXg==","XU92UC0mT25zUntVNz8uOm87Y0gtWzZFVmIhYjRATlJadmxwa3AiN2cgfTFJJyU3N0V9MFYnd2Rnd0Y/JVlcZjA=","OFJrTCRKbHQ9LGUtLFBZZ3xAfSdeQ3xZZTUpS1RlYElvISlbPkkwI0thL11TLDRuWntHLiR+ZDNo","OjBxPVdaXVBDI35pLWt1ZS0mNDooLlAqZVJ0dDgzJFlZK2d6WC5LXSsuQio0e2lEV2lfTStuX1wj","LkBpTiczInw=","XWBlYHBiZV5LOilCe3tZRmU2fHE/bSElRmk1ITo7KlcwJFBpOjZiTWVeYTprTkxyXiBRcyF0S0A4VCVTU0lmemF+TkpASkcuLGJ1Q1BtWSpgW2R6ag==","Z0VxXFpRQEJrITAkbSV9JEkyJStFenZTZzpBcj5bPTRRTnNHOWRALC5qc11MMlh3KTQtcjBOdTo5IUJwPmgyY0cmO1lib2xHMitgdyx5XSQoND4yRVUjXCpscg==","NU5DQiZFajg+YTBbVHZSeC5ER2UrTyBtKyxYN2VkeUFPND1HKlAqLw==","OGZoXigzXlU/VyVcRy12dSgzXis=","OTdxP1Znblh3cDB3XSZDZTwjeTxMOTpPZEtRaFV4OF40JHRpZiR9KGpoMjEgPkdkYH1YXTdBby5BQEw0TzlBcEoue3VPTzZyaXU4WSVjVw==","MkZScn4mLSN2S19gVVMmL306IVVOMyQsPyRtbl57VXA5RXI6OywwaFFwOUBzSU1hJUBEXHI+OUVPLw==","ZGwqU1p9I349S3R1aFQ8JH5EfWN9Z10nSmQhIEYnMkMmWVt3OEAvPzVc","X2Y3amtKTTk3UH41Ri52N35OZFI1ODxwWX5rfEd8LGEhcGhOVk5YVkltbw==","PjomWSgjNWd4KltcUjc0OD4zVnUkMHtfLSQgXkkuLmhyRGVxISo2d29aP0dbc140Q0p6XCR6WEp4KlM6S3QmUGonSSxENCQkIiw/Vy5nOm8=","O2tHMzV6c0hXfDYldUpHI045RWN7YyZhZWU8ODFlY1ZpJyteLC0wYjlcUSwgWjQ+WUh9NEUtT3ZoIF5wT1g0QVpLfms7M0tSRjkjT2h7O09NQXpANg==","T0BOdV81T1kqVnlKR2YuPTIjbUk5Wys4R3ZyIGhBLGBGLk45Tmc9UyklNTM+aGljYW8vMCBIQj09WG85TEF3R3l2I083djI0JDtTKnBuK2RzcUxk","MWJ3aGV+fWVATX1BUG0wXQ==","dUNRd0gtSlV2bi5NMCFLejQjOCNUZyp5JHZSVUhEU34yP314WTVAUWJuaWtYSCp2OllpQCw4c3p0eDU7WnVZVlVGRy9KWXxsa3oiUW1oJEh1LVBEcFI5IztpTQ==","OGVSIGtVWUN3YClvYS8tajFaYltAby08fUR8T2cvUX1FUmU=","fGBERihpPGpJXn5tICI7VVdWMSJV","KEoucDMkIEp+MWc1e2lmND0nejhcJXg9fmlLYGYlVXVRMSJWWTtwJz9tWQ==","KnVEeHlDIDdEb15PTzdfJEZAUXc4IEBB","Nlh+Pmk0c2VcRl5SLw==","IiEoa0Bmei45InI6SGNkaDJLYXc4WUh5VWUzNDotODQvViNTT2Z3TA==","S2l5JXBRPVZGXWY7QEx0eDt1eCdzbic7cy5Kb1Mxbkcrd11MNFpYI3RfUXpcaS9FNlEtbyohZT4tfjhzWStOQHYya0BffS8mfH07KWBqYkM0d347QDEwY1I=","Z3NgXm9CI0EyOm8xdzs0a1BOT0JaJFExNkoyI2sxRFQ5NkMuayhlc3d6Lz5EMV1zKjdya1hCa1ZraTNJSl99Om4sQCN7UFYya2JVWEpuaHEzQC9YLw==","WC97JD5CPHh2WltJamZmL3tmLHx1czshNmAlenosUUZ9STYwe2prQDszRzNPbFVSJWFefGEuPg=="];

const tests = [
  // {
  //   name: 'toUtf8Bin("💩")',
  //   is: toUtf8Bin('💩'),
  //   want: Array.from(new TextEncoder().encode('💩')).map(el => (el.toString(2)).padStart(8, '0')).join('')
  // },
  // {
  //   name: 'toUtf8Bin(" ")',
  //   is: toUtf8Bin(' '),
  //   want: Array.from(new TextEncoder().encode(' ')).map(el => (el.toString(2)).padStart(8, '0')).join('')
  // },
  // {
  //   name: 'toUtf8Bin("~")',
  //   is: toUtf8Bin('~'),
  //   want: Array.from(new TextEncoder().encode('~')).map(el => (el.toString(2)).padStart(8, '0')).join('')
  // },

  // {
  //   name: 'fromUtf8Bin("11110000100111111001001010101001")',
  //   is: fromUtf8Bin('11110000100111111001001010101001'),
  //   want: '💩'
  // },

  // {
  //   name: 'toUtf8Bin("")',
  //   is: toUtf8Bin(''),
  //   want: null
  // },
  {
    name: 'toUtf8Bin("💩")',
    is: toUtf8Bin('💩'),
    want: 4036989609
  },

  {
    name: 'toUtf8Bin("💩")',
    is: toUtf8Bin('💩'),
    want: 4036989609
  },
  {
    name: 'toUtf8Bin(" ")',
    is: toUtf8Bin(' '),
    want: 32
  },
  {
    name: 'toUtf8Bin("~")',
    is: toUtf8Bin('~'),
    want: 126  },
  {
    name: 'toUtf8Bin("鑫")',
    is: toUtf8Bin('鑫'),
    want: 15307179
  },
  {
    name: 'toUtf8Bin("𝔘")',
    is: toUtf8Bin('𝔘'),
    want: 4036859032
  },
  {
    name: 'toUtf8Bin("Á")',
    is: toUtf8Bin('Á'),
    want: 50049
  },
  {
    name: 'toUtf8Bin("λ")',
    is: toUtf8Bin('λ'),
    want: 52923
  },

  // {
  //   name: 'toB64("")',
  //   is: toB64(''),
  //   want: btoa('')
  // },
  // {
  //   name: 'fromB64("")',
  //   is: fromB64(''),
  //   want: atob('')
  // },

  // {
  //   name: 'toB64("<p>Hello world?!!</p>")',
  //   is: toB64('<p>Hello world?!!</p>'),
  //   want: btoa('<p>Hello world?!!</p>')
  // },
  // {
  //   name: 'toB64("©")',
  //   is: toB64('©'),
  //   want: 'wqk='
  // },
  // {
  //   name: 'toB64("Hello, 💩!")',
  //   is: toB64('Hello, 💩!'),
  //   want: 'SGVsbG8sIPCfkqkh'
  // },
  // {
  //   name: 'toB64("你好，世界！")',
  //   is: toB64('你好，世界！'),
  //   want: '5L2g5aW977yM5LiW55WM77yB'
  // },

  // {
  //   name: 'fromB64("SGVsbG8sIHdvcmxkIQ==")',
  //   is: fromB64('SGVsbG8sIHdvcmxkIQ=='),
  //   want: atob('SGVsbG8sIHdvcmxkIQ==')
  // },
  // {
  //   name: 'fromB64("SGVsbG8sIPCfkqkh")',
  //   is: fromB64('SGVsbG8sIPCfkqkh'),
  //   want: 'Hello, 💩!'
  // },
  // {
  //   name: 'fromB64("5L2g5aW977yM5LiW55WM77yB")',
  //   is: fromB64('5L2g5aW977yM5LiW55WM77yB'),
  //   want: '你好，世界！'
  // },
  // {
  //   name: 'fromB64("wqk=")',
  //   is: fromB64('wqk='),
  //   want: '©'
  // },

  // {
  //   name: 'fromB64("[]{}")',
  //   is: (() => {
  //     try {
  //       fromB64("[]{}");
  //     } catch (err) {
  //       return err.message;
  //     }
  //   })(),
  //   want: 'Invalid base64 characters: "[", "]", "{", "}"'
  // },

  // {
  //   name: 'fromB64("SGVsbG8sIHdvcmxkIQ=")',
  //   is: fromB64("SGVsbG8sIHdvcmxkIQ="),
  //   want: 'Hello, world!'
  // },

  // {
  //   name: 'toB64("o\\x00o")',
  //   is: (() => {
  //     try {
  //       toB64("o\x00o");
  //     } catch (err) {
  //       return err.message;
  //     }
  //   })(),
  //   want: 'String for conversion contains null character at index 1'
  // },

  // {
  //   name: 'misc discrepencies between `btoa` and `toB64`',
  //   is: JSON.stringify(miscToB64Tests.filter(el => btoa(el) !== toB64(el))),
  //   want: '[]'
  // },

  // {
  //   name: 'misc discrepencies between `atob` and `fromB64`',
  //   is: JSON.stringify(miscFromB64Tests.filter(el => atob(el) !== fromB64(el))),
  //   want: '[]'
  // },

  // {
  //   name: 'reconversion discrepencies',
  //   is: JSON.stringify(miscReconversionTests.filter(el => el !== fromB64(toB64(el)))),
  //   want: '[]'
  // }

];

const passing = tests.filter(test => test.want === test.is);
const failing = tests.filter(test => test.want !== test.is);

console.groupCollapsed(`Passing tests (${passing.length})`);
passing.forEach(test => {
  console.group(`%c${test.name}`, 'color: green');
  console.log(`Result: ${test.is}`);
  console.groupEnd();
});
console.groupEnd();

console.group(`Failing tests (${failing.length})`);
failing.forEach(test => {
  console.group(`%c${test.name}`, 'color: red');
  console.log(`Expected: ${test.want}`);
  console.log(`Actual: ${test.is}`);
  console.groupEnd();
});
console.groupEnd();
