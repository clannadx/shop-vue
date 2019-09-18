// const autoprefixer = require('autoprefixer')
// const pxtorem = require('postcss-pxtorem')

// module.exports = ({ file }) => {
//   let rootValue
//   // vant 37.5 [link](https://github.com/youzan/vant/issues/1181)
//   if (file && file.dirname && file.dirname.indexOf('vant') > -1) {
//     rootValue = 37.5
//   } else {
//     rootValue = 37.5
//   }
//   return {
//     plugins: [
//       autoprefixer(),
//       pxtorem({
//         rootValue: rootValue,
//         propList: ['*'],
//         // unitPrecision:10,
//         // selectorBlackList:[/^body$/],
//         minPixelValue: 2
//       })
//     ]
//   }
// }

module.exports = {
  plugins: {
    autoprefixer: {}
  }
};