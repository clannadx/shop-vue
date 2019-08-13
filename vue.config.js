const path = require('path');

function resolve(dir = '') {
  return path.join(__dirname, './src', dir);
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    //九键输入法的 「mall」= 「6255」
    port: 6255,
  },
  chainWebpack: config => {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('./assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('./assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // only package third parties that are initially dependent
        },
        // vantUI: {
        //   name: 'chunk-vantUI', // split vant into a single package
        //   priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
        //   test: /[\\/]node_modules[\\/]_?vant(.*)/ // in order to adapt to cnpm
        // },
        commons: {
          name: 'chunk-commons',
          test: resolve('./components'), // can customize your rules
          minChunks: 3, //  minimum common number
          priority: 5,
          reuseExistingChunk: true
        }
      }
    })
    config.optimization.runtimeChunk('single')

  },
  configureWebpack: {
    // stats: {
    //   // warn => /Conflicting order between:/gm.test(warn)
    //   warningsFilter: warn => { return warn.indexOf('Conflicting order between:') > -1 } // if true will ignore
    // },
    resolve: {
      alias: {
        core: resolve('core')
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data:
          `@import "@/assets/scss/_var.scss";
          @import "@/assets/scss/_mixin.scss";
          `
      }
    }
  }
};
