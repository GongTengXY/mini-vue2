class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }

  // 编译模版
  compile(el) {
    let childNodes = el.childNodes
    childNodes.forEach((node) => {
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        this.compileElement(node)
      }

      // 判断node节点是否还有子节点，如果还有自己节点就采用递归调用
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  // 编译文本节点，处理差值表达式
  compileText(node) {
    // console.log(node)
    // 写一个正则表达式
    let reg = /\{\{(.+)\}\}/
    // console.log(node.textContent)
    let value = node.textContent
    console.log(value)
    if (reg.test(value)) {
      //获取插值表达式中的变量名,去掉空格（$1 表示获取第一个分组的内容。）
      let key = RegExp.$1.trim()
      console.log(key)
      //根据变量名，获取data中的具体值，然后替换掉差值表达式中的变量名.
      node.textContent = value.replace(reg, this.vm[key])

      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }
  // 编译元素节点，处理指令
  compileElement(node) {
    // console.log(node)
    let attrs = node.attributes
    Array.from(attrs).forEach((attr) => {
      let attrName = attr.name
      attrName = attrName.substr(2) // 这一步截取到了v-指令后面的字符串
      let key = attr.value
      this.update(node, key, attrName)
    })
  }
  // 处理调用指令解析后的方法
  update(node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, key, this.vm[key]) // 给指令方法传输的是data中对应的属性值
  }
  // 处理各项指令的方法
  // v-text
  textUpdater(node, key, value) {
    node.textContent = value
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }
  // v-model
  modelUpdater(node, key, value) {
    node.value = value
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  // 判断元素属性是否为指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  // 判断节点是否为文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  // 判断节点是否为元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}
