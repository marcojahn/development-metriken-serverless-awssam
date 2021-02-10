const path = require("path");
const glob = require("glob");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Credits: https://hackernoon.com/webpack-creating-dynamically-named-outputs-for-wildcarded-entry-files-9241f596b065
const entryArray = glob.sync("./src/**/index.ts");

const entryObject = entryArray.reduce((acc, item) => {
  let name = path.dirname(item.replace("./src/", ""));
  // conforms with Webpack entry API
  // Example: { ingest: './src/ingest/index.ts' }
  acc[name] = item;
  return acc;
}, {});

module.exports = {
  entry: entryObject,
  //devtool: "source-map",
  target: "node",
//   optimization: {
//     usedExports: true
//   },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
//   plugins: [
//       new BundleAnalyzerPlugin()
//   ],
  // Output directive will generate build/<function-name>/index.js
  output: {
    filename: "[name]/index.js",
    path: path.resolve(__dirname, "build"),
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    // Credit to Richard Buggy!!
    libraryTarget: "commonjs2",
  },
};
