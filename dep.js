class Dep {
    constructor() {
        // 存储所有的观察者
        this.subs = []
    }

    addSub(sub) {
        if (sub&&sub.update) {
            this.subs.push(sub)
        }
    }

    // 发送通知存储着的观察者，调用观察者中的update方法
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}
