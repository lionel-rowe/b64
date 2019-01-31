const { fromUtf8B64, toUtf8B64, fromUtf8Arr, toUtf8Arr, B64_ERROR_TYPE } = require('./b64');
const { upsertQuery, getQuery } = require('./queryString');
const swal = require('sweetalert');

const setVal = (node, newVal) => {
  // if ([ 'INPUT', 'TEXTAREA' ].includes(node.tagName)) {
    node.value = newVal;
  // }

  // if (!([ 'INPUT' ].includes(node.tagName))) {
    node.textContent = newVal;
  // }
}

const form = document.querySelector('#form');

const input = document.querySelector('#input');
const output = document.querySelector('#output');

const srcType = document.querySelector('#srcType');
const trgType = document.querySelector('#trgType');

const directionalitySelector = document.querySelector('#directionalitySelector');

const convertButton = document.querySelector('#convertButton');

directionalitySelector.removeAttribute('href');

let encode = getQuery('direction') !== 'decode';

let [ src, trg ] = [
  encode ? input.value : input.value.trim(),
  output.value || output.textContent
];

const flipDirectionality = () => {
  encode = !encode;

  setVal(srcType, encode ? 'Plaintext' : 'Base64');
  setVal(trgType, encode ? 'Base64' : 'Plaintext');

  setVal(convertButton, encode ? 'Encode' : 'Decode');

  if (trg.length) {
    [ src, trg ] = [ trg, src ]
    setVal(input, src);
    setVal(output, trg);
  }

  input.focus();
};

const flip = e => {
  e.preventDefault();

  flipDirectionality();

  upsertQuery('input', encode ? input.value : input.value.trim());
  upsertQuery('direction', encode ? 'encode' : 'decode');
};

directionalitySelector.addEventListener('click', flip);
directionalitySelector.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    flip(e);
  }
});

form.addEventListener('submit', e => {

  e.preventDefault();

  try {
    src = encode ? input.value : input.value.trim();
    trg = encode ? toUtf8B64(src) : fromUtf8B64(src);
    setVal(output, trg);

    upsertQuery('input', src);

  } catch (e) {

    if (e.$$typeof === B64_ERROR_TYPE) {
      const mainDiv = document.createElement('div');

      if (e.message) {
        const msgDiv = document.createElement('div');

        msgDiv.textContent = e.message;
        mainDiv.appendChild(msgDiv);
      }

      if (e.data) {
        const dataDiv = document.createElement('div');

        Object.keys(e.data).forEach(key => {

          const k = document.createElement('span');
          k.textContent = `${key}: `;

          const v = document.createElement('code');
          v.textContent = e.data[key];

          dataDiv.appendChild(k);
          dataDiv.appendChild(v);
        });

        mainDiv.appendChild(dataDiv);
      }

      swal({
        title: `Cannot ${encode ? 'Encode' : 'Decode'}`,
        content: mainDiv,
        icon: 'error'
      });
    }
  }

});

const errorEl = document.querySelector('#error');

if (errorEl) {
  const removeErrorEl = e => {
    if (!e.key || e.key === 'Enter') {
      errorEl.remove();

      directionalitySelector.removeEventListener('click', removeErrorEl);
      directionalitySelector.addEventListener('keydown', removeErrorEl);
      form.removeEventListener('submit', removeErrorEl);
    }
  };

  directionalitySelector.addEventListener('click', removeErrorEl);
  directionalitySelector.addEventListener('keydown', removeErrorEl);
  form.addEventListener('submit', removeErrorEl);
}

window.fromUtf8B64 = fromUtf8B64;
window.toUtf8B64 = toUtf8B64;
window.fromUtf8Arr = fromUtf8Arr;
window.toUtf8Arr = toUtf8Arr;
