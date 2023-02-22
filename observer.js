class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(data, key, value) {
    let that = this
    this.walk(value)
    let dep = new Dep()
    Object.defineProperty(data, key, {
      get() {
        // console.log(Dep.target) 它就是watcher实例
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newValue) {
        if (value === newValue) {
          return
        }
        value = newValue
        that.walk(newValue)
        // 发送通知，更新数据视图
        dep.notify()
      },
    })
  }
}
