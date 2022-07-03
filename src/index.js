// 将所有的方法都耦合在一起
// class Vue {
//     xxx() {

//     }

//     xxx() {

//     }
// }

import { initMixin } from './init'

function Vue(options) { // options就是用户的选项
    debugger
    this._init(options)
}

initMixin(Vue) // 扩展了init方法

export default Vue