const { utf8Encode, utf8Decode, B64_ERROR_TYPE } = require('./b64');
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
  input.value,
  output.value || output.textContent
];

const flipDirectionality = () => {
  encode = !encode;

  setVal(srcType, encode ? 'Text' : 'Base64');
  setVal(trgType, encode ? 'Base64' : 'Text');

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

  upsertQuery('input', input.value);
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
    src = input.value;
    trg = encode ? utf8Encode(src) : utf8Decode(src);
    setVal(output, trg);

    upsertQuery('input', src);

  } catch (e) {

    if (e.$$typeof === B64_ERROR_TYPE) {
      const mainDiv = document.createElement('div');

      if (e.message) {
        const msgDiv = document.createElement('div');

        msgDiv.innerHTML = e.message;
        mainDiv.appendChild(msgDiv);
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

window.utf8Decode = utf8Decode;
window.utf8Encode = utf8Encode;
