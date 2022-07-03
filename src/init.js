import { initState } from "./state"

export function initMixin(Vue) {
    Vue.prototype._init = function (options) { // 用于初始化操作
        // vue vm.$options 获取用户的配置

        // 我们使用的 vue的时候 $nextTick $data $attr ...
        const vm = this
        vm.$options = options // 将用户的选项挂载到实例上

        // 初始化状态
        initState(vm)
        // todo...
    }
}

