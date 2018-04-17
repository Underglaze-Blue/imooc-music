import originJSONP from 'jsonp';

export function jsonp (url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + params(data);
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (error, dataJSON) => {
      if (!error) {
        resolve(dataJSON);
      } else {
        reject(error);
      }
    });
  });
};

function params (data) {
  let url = '';
  for (let i in data) {
    let value = data[i] !== undefined ? data[i] : '';
    url += `&${i}=${encodeURIComponent(value)}`;
  }
  return url ? url.substring(1) : '';
}
