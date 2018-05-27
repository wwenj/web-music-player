import originJsonp from 'jsonp'

export default function jsonp(url, data, option) { // 改装下原函数，把url和data传值分开
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data) // 第一位传值前加上？号，如果已经url上传过参数则加上&拼接data传来的参数

  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => { // url默认要求带上请求参数
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

export function param(data) { // 枚举出data传值对象，把键值对用=相连，加上&字符串，拼接到一起
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : '' // 如果有传值，删除拼接后第一位的&符
}
