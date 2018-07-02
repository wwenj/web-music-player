import {
  getLyric
} from 'api/song'
import {
  ERR_OK
} from 'api/config'
import {
  Base64
} from 'js-base64'

export default class Song {
  constructor({
    id,
    mid,
    singer,
    name,
    album,
    duration,
    image,
    url
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer //歌手
    this.name = name //歌名
    this.album = album // 专辑
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong(musicData) { // 是对歌手详情页数据的封装处理
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=&guid=1472133172&uin=0&fromtag=66`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export function songUrl(vkey, mid) {
  var url = `http://dl.stream.qqmusic.qq.com/http://dl.stream.qqmusic.qq.com/C400${mid}.m4a?vkey=${vkey}&guid=1472133172&uin=0&fromtag=66`
  // `http://dl.stream.qqmusic.qq.com/http://dl.stream.qqmusic.qq.com/C400004IsqcS2BilGv.m4a?guid=5802445895&vkey=&uin=0&fromtag=38
  return url
}

export function recomSongList(res) {
  res = res.replace(/jsonCallback/, "");
  res = res.replace(/\(/g, " ");
  res = res.replace(/\)/g, " ");
  return JSON.parse(res)
}
