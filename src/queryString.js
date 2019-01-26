const getQueries = () => {
  return document.location.search ? document.location.search.slice(1).split('&').map(el => el.split('=')) : [];
};

const getQuery = (key) => {
  const queries = getQueries();

  const kEnc = encodeURIComponent(key);

  const kv = queries.find(([k, _v]) => k === kEnc);

  return kv ? kv[1] : null;
}

const makeQueryString = (queries) => {
  return queries.length ? `?${queries.map(el => el.join('=')).join('&')}` : '';
};

const modifyQueries = (queries, k, v) => {

  let found;
  let idx = 0;

  const [ kEnc, vEnc ] = [ k, v ].map(el => encodeURIComponent(el));

  const el = queries.find(([key, _val]) => key === kEnc);

  if (!v) {
    const idx = queries.indexOf(el);
    if (idx >= 0) queries.splice(idx, idx + 1);
  } else if (el) {
    el[1] = vEnc;
  } else if (!el) {
    queries.push([kEnc, vEnc]);
  }

  return queries;
};

const upsertQuery = (k, v) => {

  if (window.history && window.history.replaceState) {

    const queries = getQueries();
    const newQueries = modifyQueries(queries, k, v);
    const newQueryString = makeQueryString(newQueries);

    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${newQueryString}`;
      window.history.replaceState({path: newUrl}, null, newUrl);
  }

};

module.exports = { upsertQuery, getQuery };
