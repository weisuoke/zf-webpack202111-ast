let esprima = require('esprima'); // 它可以把源代码转换成抽象语法树
let estraverse = require('estraverse'); // 它可以遍历语法树，修改树上的语法节点
let escodegen = require('escodegen');

let sourceCode = 'function ast(){}';

let ast = esprima.parse(sourceCode)
let indent = 0;
const padding = () => ` `.repeat(indent)

estraverse.traverse(ast, {
  enter(node, parent) {
    console.log(padding() + node.type)
    if (node.type === 'FunctionDeclaration') {
      node.id.name = 'newFunction'
    }
    indent++
  },
  leave(node, parent) {
    indent--
    console.log(padding() + node.type)
  }
})

// 重新生成源代码
let newSourceCode = escodegen.generate(ast)
console.log(newSourceCode)