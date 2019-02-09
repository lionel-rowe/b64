const express = require('express');
const exphbs  = require('express-handlebars');
const cookieParser = require('cookie-parser');
const useragent = require('useragent');

const { utf8Encode, utf8Decode, B64_ERROR_TYPE } = require('./src/b64');

const app = express();

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(express.static('public'));
app.use(cookieParser());

const generateErrorMessage = e => {
  if (e.$$typeof === B64_ERROR_TYPE) {
    return {
      message: e.message || '',
      // data: e.data ? Object.keys(e.data).map(key => `${key}: ${e.data[key]}`).join('; ') : ''
    };
  } else {
    console.log(e);
    return { message: 'An unknown error occurred.' }
  }
};

app.get('/', (req, res, next) => {
    const ua = useragent.parse(req.headers['user-agent']);
    const isModern = ['IE', 'Opera Mini'].every(el => ua.family !== el); //rough approximation

    const { input, direction } = req.query || {};

    const js = isModern && (req.cookies.js !== 'false');

    const decode = direction === 'decode';

    const fn = decode ? utf8Decode : utf8Encode;
    const trimmedInput = decode ? input && input.trim() : input;

    let result = '';
    let error;

    const from = decode ? 'Base64': 'Text';
    const to = decode ? 'Text' : 'Base64';

    const directionLowerCase = decode ? 'decode' : 'encode';
    const directionCapitalized = directionLowerCase[0].toUpperCase() + directionLowerCase.slice(1);

    try {
      result = trimmedInput ? fn(input) : undefined;
    } catch(e) {
      error = generateErrorMessage(e);
      error.title = `Cannot ${directionCapitalized}`;
    }

    res.render(__dirname + '/views/index.hbs', {
      from, to, result, error, js, directionLowerCase, directionCapitalized,
      input: trimmedInput,
      oppositeDirection: decode ? 'encode' : 'decode'
    });

});

app.get('/api/v1/:direction/:text', (req, res, next) => {

  const { direction, text } = req.params;

  let fn;

  if (direction === 'encode') {
    fn = utf8Encode;
  } else if (direction === 'decode') {
    fn = utf8Decode;
  } else {
    return next();
  }

  let result;
  let error;

  try {
    result = fn(text);
  } catch(e) {
    error = generateErrorMessage(e);
  }

  const data = {
    direction: 'encode',
    input: text
  };

  result ? data.result = result : data.error = error;

  res.json({ data });

});

// app.get('/decode/:b64', (req, res, next) => {
//   const { b64 } = req.params;

//   res.json({
//     data: {
//       direction: 'decode',
//       input: b64,
//       result: utf8Decode(b64)
//     }
//   });

// });

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
