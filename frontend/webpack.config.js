const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

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
        use: "babel-loader"
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public/index.html", to: "index.html" }
      ]
    })
  ],
  resolve: { extensions: [".js", ".jsx"] },
  mode: "production"
};
