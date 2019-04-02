module.exports = {
  pluginOptions: {
    moment: {
      locales: [
        ''
      ]
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://rap2api.taobao.org/app/mock/22199/',
        changeOrigin: true
      }
    }
  }
}