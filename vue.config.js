module.exports = {
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    // extract: true,
    // // 开启 CSS source maps?
    // sourceMap: false,
    // // css预设器配置项
    // loaderOptions: {},
    // 默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。
    // 设置为 false 后你就可以去掉文件名中的 .module 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。
    requireModuleExtension: true
  },
  devServer: {
    disableHostCheck: true
  }
}
