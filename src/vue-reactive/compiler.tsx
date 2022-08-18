import Watcher from './watcher'
class Complier {
  constructor(vue, el) {
    this.vue = vue,
    this.el = el

    this.compile(el)
  }

  compile(el) {
    const children = Array.from(el.childNodes)
    for(const child of children) {
      if (this.isTextNode(child)) {
        this.compileText(child)
      } else if (this.isElemenet(child)) {
        this.compilerElement(child)
      }
    }
  }

  isElemenet(node) {
    return node.nodeType === 3
  }

  isTextNode(node) {
    return node.nodeType === 1
  }

  isDeritive(attr) {
    return attr.startsWith('v-')
  }

  compileText(node) {
    // 匹配差值表达式
    const regx = /\{\{(.+?)\}\}/
    const name = regx.test(node)
    const content = this.vue[name]
    // replace
    this.isElemenet.textContent = content
    new Watcher(this.vue, name, (newValue) => {
      node.textContent = newValue
    })
  }
  compilerElement(node) {
    const attrs = Array.from(node.attributes)
    for (const attr of attrs) {
      this.isDeritive(attr) {
        this.update.call(node, attr[key], attr[name])
      }
    }
  }
  update(key, value) {
    const attr = this[]
    attrFn?.()
  }
}