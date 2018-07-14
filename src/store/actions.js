import * as types from './mutation-types'
// import {playMode} from 'common/js/config'
// import {shuffle} from 'common/js/util'
import {
  saveSearch,
  clearSearch,
  deleteSearch,
  savePlay,
  saveFavorite,
  deleteFavorite
} from 'assets/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({
  commit,
  state
}, {
  list,
  index
}) {
  commit(types.SET_SEQUENCE_LIST, list)
  // if (state.mode === playMode.random) {
  //   let randomList = shuffle(list)
  //   commit(types.SET_PLAYLIST, randomList)
  //   index = findIndex(randomList, list[index])
  // } else {
  //   commit(types.SET_PLAYLIST, list)
  // }
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index) // 当前播放索引
  // commit(types.SET_VKEY, vkey) // 当前获取vkey
  commit(types.SET_FULL_SCREEN, true) // 当前播放页的展开收起
  commit(types.SET_PLAYING_STATE, true) // 播放状态
}

// export const randomPlay = function ({commit}, {list}) { // 随机播放
//   commit(types.SET_PLAY_MODE, playMode.random)
//   commit(types.SET_SEQUENCE_LIST, list)
//   let randomList = shuffle(list)
//   commit(types.SET_PLAYLIST, randomList)
//   commit(types.SET_CURRENT_INDEX, 0)
//   commit(types.SET_FULL_SCREEN, true)
//   commit(types.SET_PLAYING_STATE, true)
// }

export const insertSong = function ({ // 搜索页添加歌曲到播放列表
  commit,
  state
}, song) {
  let playlist = state.playlist.slice() // 赋值的是对象引用，state不允许外部修改，用slice()做个副本赋值
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌就删除，否则playlist播放出现重复在播放列表组件中也会出现重复
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }
  // 查找当前播放索引
  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)
  // 插入歌曲
  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({ // 保存一个历史记录
  commit
}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, query) { // 删除某一个记录
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({commit}) { // 清除所有记录
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function ({commit, state}, song) { // 清除当前播放列表
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song) // 找到当前播放playlist中的索引
  playlist.splice(pIndex, 1) // 删除点击这条
  let sIndex = findIndex(sequenceList, song) // 找到顺序列表中的索引
  sequenceList.splice(sIndex, 1) // 删除这条
  if (currentIndex > pIndex || currentIndex === playlist.length) { // 如果删除的是播放前面的一条则需要把当前播放索引减一
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if (!playlist.length) { // 如果当前列表空了，关闭播放
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

export const deleteSongList = function ({commit}) { // 直接清空，全部恢复初始值
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function ({commit}, song) { // 保存播放记录
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function ({commit}, song) { // 保存我的收藏
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) { // 取消收藏
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
