const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      }
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  devServer: {
    historyApiFallback: true,
  },
};
