/**
 * commjs的模块加载流程
 *
 * 核心/第三方包模块
 * 自定义文件模块
 * module对象：id path filename paths children loaded
 *
 * 同步 运行时加载
 * 使用缓存优先原则，只执行一次，无法监听到文件内部的变化
 *
 * 路径分析：拼接成绝对路径,
 * 文件定位: js > json > node > 文件目录,package.json main > index
 * 编译执行：针对不同的文件执行不同的逻辑
 */
const fs = require("fs");
const vm = require("vm");
const path = require("path");

class Module {
  // static
  static _extensions = {
    ".js"() {
      const __dirname = this.dirname;
      const __filename = this.filename;
      const exports = this.exports;
      const content = fs.readFileSync(module.path, "utf-8");
      const wrapperFn = `function(require, exports, module, __dirname, __filename){${content}}`;
      const vmI = new vm();
      const fn = vmI.runInthisContext(wrapperFn);
      fn();
    },
    ".json"() {
      const content = fs.readFileSync(module.path, "utf-8");
      this.exports = JSON.parse(content);
    },
    ".node"() {}
  };
  static _cache = {};
  static resolveFilename(path) {
    const absPath = path.resolve(path);

    if (fs.existsSync(absPath)) {
      return absPath;
    } else {
      const extensions = Object.keys(Module._extensions);
      for (const extension of extensions) {
        if (fs.existsSync(`${absPath}${extension}`)) {
          return `${absPath}${extension}`;
        }
      }
      throw new Error("file dont exist");
    }
  }

  // 实例module
  constructor(rpath) {
    this.id = rpath;
    this.path = rpath;
    this.filename = rpath;
    this.dirname = path.dirname(rpath);
    this.paths = [];
    this.children = [];
    this.loaded = false;
    this.exports = {};
  }

  compile() {
    // 根据后缀执行不同的编译方法
    Module._extensions[path.extname(this.path)]?.call(this);
    return this.exports;
  }
}
function myRequire(id) {
  // 路径分析，文件定位
  const absPath = Module.resolveFilename(id);
  // 缓存优先
  if (Module._cache[absPath]) return Module._cache[absPath].exports;
  // 新建module实例，并根据文件类型编译执行，做不同的处理
  const module = new Module(absPath);
  Module._cache[absPath] = module;

  module.compile();
}
