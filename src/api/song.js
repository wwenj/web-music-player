import {
  commonParams
} from './config'
import axios from 'axios'

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
};

/* 获取播放源连接密钥 */
export function getVkey(songmid) {
  const url = '/api/vkey'

  const data = Object.assign({}, commonParams, {
    songmid: songmid,
    filename: `C400${songmid}.m4a`,
    guid: "1472133172",
    uin: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: "205361747",
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
