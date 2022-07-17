// 可以引 htmlparser2 来替换该模块

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`


const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配的分组是一个标签名 <div
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配的是</xxxx> 最终匹配到的分组就是结束标签的名字

const attribute = /^\s*([^\s"'<br>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>']+)))?/ // 匹配属性
// 第一个分组就是属性的key；value就是分组3/分组4/分组5

const startTagClose = /^\s*(\/?)>/  // <div> <br/> 
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g  // {{ assdewd }} 匹配到的内容就是我们表达式的变量


// vue3 采用的不是使用正则
// 对模板进行编译处理

// {
//     tag: 'div',
//         type: 1,
//             attrs: [{ name, age, address }],
//                 parent: null,
//                     children: [
//                         {
//                             tag: 'div',
//                             type: 1,
//                             attrs: [{ name, age, address }],
//                             parent: null,
//                             children: [ ]
//                         }
//                     ]
// }

export function parseHTML(html) { // html最开始肯定是一个 < （vue2肯定是标签开始）

    const ELEMENT_TYPE = 1
    const TEXT_TYPE = 3
    const stack = [] // 用于存放元素的
    let currentParent // 指向的是栈中的最后一个 
    let root

    // 最终需要转化成一颗抽象语法树
    function createASTElement(tag, attrs) {
        return {
            tag,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }

    // 利用栈型结构，来构造一棵树
    function start(tag, attrs) {
        // console.log(tag, attrs, "开始")
        let node = createASTElement(tag, attrs) // 创造一个ast节点
        if (!root) { // 看一下是否是空树
            root = node // 如果为空则当前是树的根节点
        }
        if (currentParent) {
            node.parent = currentParent
            currentParent.children.push(node)
        }
        stack.push(node)
        currentParent = node // currentParent为栈中的最后一个
    }

    function chars(text) {
        // console.log(text, "文本")
        text = text.replace(/\s/g, '') // 如果空格超过2就删除2个以上的（没实现）
        text && currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent
        })
    }

    function end(tag) {
        // console.log(tag, "结束")
        let node = stack.pop() // 弹出最后一个, 校验标签是否合法 （node.tag 是否等于 tag）
        currentParent = stack[stack.length - 1]
    }

    function advance(n) {
        html = html.substring(n)
    }
    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1], // 标签名
                attrs: []
            }
            advance(start[0].length)

            // 如果不是开始标签的结束 就一直匹配下去
            let attr, end
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] || true }) // 单一个属性 disable （默认给个true）
            }

            if (end) {
                advance(end[0].length)
            }

            return match
        }

        return false // 不是开始标签
    }

    while (html) {
        // debugger
        // 如果textEnd为0，说明是一个开始标签或者结束标签
        // 如果textEnd > 0, 说明就是文本的结束位置
        let textEnd = html.indexOf('<') // 如果indexOf中的索引是0 则说明是一个标签

        if (textEnd == 0) {
            const startTagMatch = parseStartTag() // 开始标签的匹配结果

            if (startTagMatch) { // 解析到的开始标签
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }

            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }

        if (textEnd >= 0) {
            let text = html.substring(0, textEnd) // 文本内容
            if (text) {
                chars(text)
                advance(text.length) // 解析到的文本
            }
        }
    }

    console.log(root)
    return root
}
