# Vue音乐播放器webapp

## 项目截图

**推荐页，排行页，歌手页**

![推荐页，排行页，歌手页](https://github.com/wwenj/web-music-player/blob/master/screenshot/1.jpg)

**搜索页，我的本地（收藏，播放历史）**

![搜索页，我的收藏](https://github.com/wwenj/web-music-player/blob/master/screenshot/2.jpg)

**详情页，播放列表，添加歌曲到播放列表**

![搜索页，我的收藏](https://github.com/wwenj/web-music-player/blob/master/screenshot/3.jpg)

**播放页，歌词页**

![搜索页，我的收藏](https://github.com/wwenj/web-music-player/blob/master/screenshot/4.jpg)

## 项目简介

基于vue全家桶开发的一款**移动端**音乐播放器webapp，数据由qq音乐后台通过jsonp跨域和代理获取

## 技术栈

- **前端**：vue全家桶，es6，sass，axios，**jsonp**，**better-scroll**

- **数据**：qq音乐接口扒取

## 功能模块：

### 页面

1. **推荐页：** 轮播，推荐歌单，点击跳转详情组件 下3同
2. **歌手页：**按姓氏首字母排列，点击侧面字母栏跳转到对应歌手区域
3. **排行页：**几种榜单，详情页显示排行数字
4. **搜索页：**搜索框**监听**内容变化显示搜索结果，搜索结果**上拉加载**，点击搜索结果添加到当前播放列表并播放该歌曲，搜索为歌手跳转歌手详情页；保存**搜索历史**，显示**热门搜索**标签
5. **个人页：**选项卡显示**最近播放**历史，与我的**收藏列表**
6. **播放页：** 旋转大头像，播放时间，**进度条**，上一曲下一曲，收藏，**播放模式**（单曲-顺序-随机），**歌词页**，播放按钮，迷你底部播放栏（播放页收起时显示）

### 功能

1. **播放列表：** 显示当前播放列表，查看播放模式，**清空列表**，点击收藏，点击删除，点击添加歌曲到当前播放列表
2. **添加歌曲到播放列表：**搜索歌曲添加，播放历史添加，搜索历史添加
3. **播放组件：**拖动进度条跳转播放进度，歌词跟随进度联动

##难点收获











## 项目运行

``` bash
# 下载依赖
npm install

# serve with hot reload at localhost:8081
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

作者 [[王文健\]](http://www.wwenj.com/)  2018 年 7月 15日 