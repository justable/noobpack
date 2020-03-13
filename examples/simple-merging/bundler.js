const config = require("./noobpack.config.js");
const { Noobpack } = require("../../lib/noobpack.js");
new Noobpack(config).bundle();
