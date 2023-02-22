class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm // vm是vue实例
    this.key = key // key是data中数据的属性名称
    this.cb = cb // 更新视图的回调函数
    Dep.target = this
    // 获取更新前的旧值
    this.oldValue = vm[key]
    Dep.target = null
  }

  update() {
    let newValue = this.vm[this.key]
    if (newValue === this.oldValue) {
        return
    }
    this.cb(newValue)
  }
}

