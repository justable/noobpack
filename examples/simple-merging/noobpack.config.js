const path = require("path");

module.exports = {
  entry: {
    pageA: "./examples/simple-merging/pages/pageA.js",
    pageB: "./examples/simple-merging/pages/pageB.js"
  },
  output: {
    path: __dirname,
    filename: "[name].js"
  }
};
