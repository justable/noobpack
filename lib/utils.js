const { normalize } = require("path");

function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function wrapModuleCode(code) {
  return `function(module, exports, require){
    ${code}
  }`;
}
function transformDepsToStr(modules) {
  const ids = Object.keys(modules);
  const allStr = ids.reduce((str, id) => {
    const entry = `,\n"${id}": ${wrapModuleCode(modules[id])}`;
    return `${str}${entry}`;
  }, "");
  return `{\n${allStr.slice(1)}\n}`;
}
module.exports = {
  normalizeEntry(entry) {
    if (typeof entry === "string" || Array.isArray(entry)) {
      return { main: entry };
    } else if (isObject(entry)) {
      return entry;
    } else {
      throw new Error("不支持的entry格式");
    }
  },
  generateFinalCode(bundle) {
    return `
    (function(modules) {
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
          exports: {}
        });

        // Execute the module function
        modules[moduleId].call(
          module.exports,
          module,
          module.exports,
          require
        );

        // Flag the module as loaded
        module.l = true;

        // Return the exports of the module
        return module.exports;
      }

      // Load entry module and return exports
      return require("${bundle.id}");
    })(${transformDepsToStr(bundle.modules)})
    `;
  }
};
