const envIsProduction = process.env.NODE_ENV == "production";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  assetsDir: "static",
  publicPath: "",
  lintOnSave: !envIsProduction,
  chainWebpack: config => {
    config.resolve.symlinks(true);
    config.resolve.alias.set("@", resolve("src"));
  },

  runtimeCompiler: true,
  configureWebpack: config => {
    if (envIsProduction) {
      // 为生产环境修改配置...
      config.mode = "production";
      config["performance"] = {
        //打包文件大小配置
        maxEntrypointSize: 10000000,
        maxAssetSize: 30000000
      };
    }
    config.plugins.forEach(val => {
      if (val instanceof HtmlWebpackPlugin) {
        val.options.title = "南京旅游助手";
      }
    });
  },
  devServer: {
    proxy: {
      "/": {
        target: "http://127.0.0.1:8888",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/": "/"
        }
      }
    }
  }
};
