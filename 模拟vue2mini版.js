// 负责接收初始化的参数(选项)
// 负责把`data`中的属性注入到`Vue`实例，转换成`getter/setter`(可以通过`this`来访问`data`中的属性)
// 负责调用`observer`监听`data`中所有属性的变化(当属性值发生变化后更新视图)
// 负责调用`compiler`解析指令/差值表达式

// `Vue`中包含了`_proxyData`这个私有方法，该方法的作用就是将`data`中的属性转换成`getter/setter`并且注入到`Vue`的实例中。
// import {Observer} from './observer.js'
// import './observer.js'

class Vue {
  constructor(options) {
    // 1.接受传递过来的选项，并且进行保存
    this.$options = options || {}
    // 获取选项参数中的data
    this.$data = options.data || {}
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el
    // 2.把data转换成getter/setter
    this._proxyData(this.$data)
    // 3.调用observer这个对象，监听数据的变化
    new Observer(this.$data)
    // 4.调用compiler对象，解析指令和差值表达式
    new Compiler(this)
  }
  _proxyData(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newValue) {
          if (data[key] === newValue) {
            return
          }
          data[key] = newValue
        },
      })
    })
  }
}
