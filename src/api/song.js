import {
  commonParams
  // options
} from './config';
// import jsonp from 'common/js/jsonp';
import {
  getUid
} from 'common/js/uid';
import { ERR_OK } from 'api/config';
import axios from 'axios';

// const debug = process.env.NODE_ENV !== 'production';

// export function getSongsUrl (songs) {
//   const url = '/api/getPurlUrl';

//   let mids = [];
//   let types = [];

//   songs.forEach((song) => {
//     mids.push(song.mid);
//     types.push(0);
//   });
//   const data = Object.assign({}, commonParams, {
//     g_tk: 5381,
//     format: 'json',
//     platform: 'h5',
//     needNewCode: 1,
//     uin: 0
//   });

//   const urlMid = genUrlMid(mids, types);

//   // return axios.post(url, {
//   //   comm: data,
//   //   url_mid: genUrlMid(mids, types)
//   // }).then((res) => {
//   //   return Promise.resolve(res.data);
//   // });
//   return new Promise((resolve, reject) => {
//     let tryTime = 3;

//     function request () {
//       return axios.post(url, {
//         comm: data,
//         url_mid: urlMid
//       }).then((response) => {
//         const res = response.data;
//         if (res.code === ERR_OK) {
//           let urlMid = res.url_mid;
//           if (urlMid && urlMid.code === ERR_OK) {
//             const info = urlMid.data.midurlinfo[0];
//             if (info && info.purl) {
//               resolve(res);
//             } else {
//               retry();
//             }
//           } else {
//             retry();
//           }
//         } else {
//           retry();
//         }
//       });
//     }

//     function retry () {
//       if (--tryTime >= 0) {
//         request();
//       } else {
//         reject(new Error('Can not get the songs url'));
//       }
//     }

//     request();
//   });
// }

export function getSongsUrl (songs) {
  const url = '/api/getPurlUrl';

  let mids = [];
  let types = [];

  songs.forEach((song) => {
    mids.push(song.mid);
    types.push(0);
  });

  const urlMid = genUrlMid(mids, types);

  const data = Object.assign({}, commonParams, {
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  });

  return new Promise((resolve, reject) => {
    let tryTime = 3;

    function request () {
      return axios.post(url, {
        comm: data,
        url_mid: urlMid
      }).then((response) => {
        const res = response.data;
        if (res.code === ERR_OK) {
          let urlMid = res.url_mid;
          if (urlMid && urlMid.code === ERR_OK) {
            const info = urlMid.data.midurlinfo[0];
            if (info && info.purl) {
              resolve(res);
            } else {
              retry();
            }
          } else {
            retry();
          }
        } else {
          retry();
        }
      });
    }

    function retry () {
      if (--tryTime >= 0) {
        request();
      } else {
        reject(new Error('Can not get the songs url'));
      }
    }

    request();
  });
}

function genUrlMid (mids, types) {
  const guid = getUid();
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  };
}

export function getLyric (mid) {
  const url = '/api/lyric';

  const data = Object.assign({}, commonParams, {
    pcachetime: +new Date(),
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    fromat: 'json'
  });

  return axios.get(url, {
    params: data
  }).then((response) => {
    return Promise.resolve(response.data);
  }).catch((error) => {
    console.log(error);
  });
}
