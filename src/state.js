import { observe } from './observe/index'

export function initState(vm) {
    const opts = vm.$options // 获取所有的选项
    if (opts.data) {
        initData(vm)
    }
}

function proxy(vm, target, key) {
    Object.defineProperty(vm, key, { // vm.name
        get() {
            return vm[target][key] // vm._data.name
        },
        set(newValue) {
            vm[target][key] = newValue
        }
    })
}

export function initData(vm) {
    let data = vm.$options.data // data可能是函数和对象
    data = typeof data === 'function' ? data.call(vm) : data

    vm._data = data
    // 对数据进行劫持 vue2 采用defineProperty
    observe(data)

    // 将vm.data 用vm来代理
    for (let key in data) {
        proxy(vm, '_data', key)
    }

}