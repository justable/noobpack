const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const path = require("path");
const { transformFromAst } = require("@babel/core");
const { normalizeEntry, generateFinalCode } = require("./utils");

class Noobpack {
  constructor(config) {
    this.config = {
      ...config,
      entry: normalizeEntry(config.entry),
    };
  }
  analyzeFile(filePath) {
    // 读取文件原始内容，basePath是执行脚本的路径
    const content = fs.readFileSync(filePath, "utf-8");
    // 将文件原始内容解析成ast
    const ast = parser.parse(content, {
      sourceType: "module",
    });
    const deps = [];
    // 遍历ast得到文件的依赖关系
    traverse(ast, {
      ImportDeclaration({ node }) {
        const dirname = path.dirname(filePath);
        // 将import依赖的相对当前文件的路径都转换成相对项目根目录的路径
        const newFile = "./" + path.join(dirname, node.source.value);
        deps.push(newFile);
        node.source.value = newFile;
      },
    });
    // 使用babel转换代码
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });
    // 输出一个文件相对项目根目录的路径，依赖，转换后的源码
    return { path: filePath, deps, code };
  }
  writeFiles(bundles) {
    bundles.forEach((bundle) => {
      fs.writeFileSync(bundle.targetPath, generateFinalCode(bundle), "utf-8");
    });
  }
  bundle() {
    const entry = this.config.entry;
    const output = this.config.output;
    const bundles = [];
    for (let name in entry) {
      const entryPath = entry[name];
      const file = this.analyzeFile(entryPath);
      const fileArray = [file];
      // 这里采用了迭代法，最终将依赖链中的所有文件平铺到fileArray数组中
      for (let i = 0; i < fileArray.length; i++) {
        const mod = fileArray[i];
        for (let j = 0, deps = mod.deps; j < deps.length; j++) {
          const dep = deps[j];
          fileArray.push(this.analyzeFile(dep));
        }
      }
      const modules = {};
      fileArray.forEach((item) => {
        // 包裹函数
        modules[item.path] = item.code;
      });
      // modules对象会出现换行符/n
      bundles.push({
        targetPath: path.join(
          output.path,
          output.filename.replace("[name]", name)
        ),
        id: entryPath,
        modules,
      });
    }
    this.writeFiles(bundles);
  }
}

module.exports = { Noobpack };
