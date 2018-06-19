module.exports = {
  proxy: {
    '/getDiscList': { //将www.exaple.com印射为/apis
      target: 'https://c.y.qq.com/', // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '^/apis': '/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg' //需要rewrite的,
      }
    }
  }
}
