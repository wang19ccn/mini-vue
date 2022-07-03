// rollup默认可以导出一个对象，作为打包的配置文件
import babel from 'rollup-plugin-babel'

export default {
    input: './src/index.js', // 入口
    output: {
        file: './dist/vue.js', // 出口
        name: 'Vue', // global.Vue
        format: 'umd', // esm es6模块 commonjs 模块 iife自执行函数 umd 统一模块规范
        sourcemap: true, // 希望可以调试代码
    },
    plugins: [
        babel({
            exclude: 'node_modules/**' // 排除node_modules所有文件
        })
    ]
}


// 为什么vue2 只能支持ie9以上 Object.defineProperty不支持低版本