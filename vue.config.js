const path = require('path');

function resolve(dir = '') {
  return path.join(__dirname, './src', dir);
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    //九键输入法的 「mall」= 「6255」
    port: 6255,
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
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

    // set preserveWhitespace
    // config.module
    //   .rule('vue')
    //   .use('vue-loader')
    //   .loader('vue-loader')
    //   .tap(options => {
    //     options.compilerOptions.preserveWhitespace = true
    //     return options
    //   })
    //   .end()

  },
  configureWebpack: {
    resolve: {
      alias: {
        core: resolve('core')
      }
    },
    optimization: {
      runtimeChunk: {
        name: entrypoint => `runtime~${entrypoint.name}`
      },
      splitChunks: {
        minChunks: 2,
        minSize: 20000,
        maxAsyncRequests: 20,
        maxInitialRequests: 30,
        name: false
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data:
          '@import "@/assets/scss/_var.scss";@import "@/assets/scss/_mixin.scss";'
      }
    }
  }
};
