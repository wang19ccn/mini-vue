import { newArrayProto } from "./array"

class Observer {
    constructor(data) {
        // Object.defineProperty只能劫持已经存在的属性（vue里面会为此单独写一些api $set $delete）

        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false // 将__ob__变成不可枚举（循环的时候无法获取）
        })
        // data.__ob__ = this // 给数据加了一个标识，如果数据上有__ob__ 则说明这个属性被观测过了

        if (Array.isArray(data)) {
            // 这里我们可以重写数组中的方法 7个变异方法 是可以修改数组本身

            data.__proto__ = newArrayProto // 需要保留数组原有的特性，并且可以重写部分方法

            this.observeArray(data) // 如果数组中放的是对象，可以监控到对象的变化
        } else {
            this.walk(data);
        }

    }

    walk(data) { // 循环对象，对属性依次劫持
        // “重新定义”属性，性能差
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }

    observeArray(data) { // 观测数组
        data.forEach(item => observe(item))
    }
}

export function defineReactive(target, key, value) { // 属性劫持；闭包，值不会被销毁，get、set都能拿到
    observe(value) // 如果value是对象，再次建立数据劫持（对所有对象劫持）
    Object.defineProperty(target, key, {
        get() { // 取值的时候，会执行get
            console.log('key', key)
            return value
        },
        set(newValue) { // 修改的时候，会执行set
            if (newValue === value) return
            observe(newValue) // 考虑newValue是用户赋的对象，要重新代理
            value = newValue
        }
    })
}

export function observe(data) {

    // 对这个对象进行劫持

    if (typeof data !== 'object' || data === null) {
        return; // 只对对象进行劫持
    }

    if (data.__ob__ instanceof Observer) { // 说明这个对象被代理过了
        return data.__ob__
    }
    // 如果一个对象被劫持过了，那就不需要再被劫持了（要判断一个对象是否被劫持过，可以增添一个实例，用实例来判断是否劫持过）

    return new Observer(data)

    console.log(data)
}