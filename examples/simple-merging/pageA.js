(function (modules) {
  // The module cache
  var installedModules = {};

  // The require function
  function require(moduleId) {
    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }

    // Create a new module (and put it into the cache)
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });

    // Execute the module function
    modules[moduleId].call(module.exports, module, module.exports, require);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  // Load entry module and return exports
  return require("./examples/simple-merging/pages/pageA.js");
})({
  "./examples/simple-merging/pages/pageA.js": function (
    module,
    exports,
    require
  ) {
    "use strict";

    var _add = _interopRequireDefault(
      require("./examples/simple-merging/pages/add.js")
    );

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

    var button = document.getElementsByTagName("button")[0];
    var inputs = document.getElementsByTagName("input");
    var result = document.getElementsByTagName("span")[0];

    button.onclick = function () {
      result.textContent = (0, _add["default"])(
        inputs[0].value,
        inputs[1].value
      );
    };
  },
  "./examples/simple-merging/pages/add.js": function (
    module,
    exports,
    require
  ) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    exports["default"] = _default;

    var _log = _interopRequireDefault(
      require("./examples/simple-merging/pages/log.js")
    );

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

    function _default(a, b) {
      (0, _log["default"])("executing add function");
      return Number(a) + Number(b);
    }
  },
  "./examples/simple-merging/pages/log.js": function (
    module,
    exports,
    require
  ) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    exports["default"] = _default;

    function _default(text) {
      console.log(text);
    }
  },
});
