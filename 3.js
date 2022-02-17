// babel 核心模块
const core = require('@babel/core')
// 用来生成或者判断节点的 AST 语法树的节点
const types = require('@babel/types')
const transformClassesPlugin = require('@babel/plugin-transform-classes');
const transformClassesPlugin2 = {
  visitor: {
    ClassDeclaration(path) {
      let node = path.node
      let id = node.id; // Identifier name: Person
      let methods = node.body.body; // Array<MethodDefinition>
      let nodes = []
      methods.forEach(method => {
        if (method.kind === 'constructor') {
          let constructorFunction = types.functionDeclaration(
            id,
            method.params,
            method.body
          )
          nodes.push(constructorFunction)
        } else {
          let memberExpression = types.memberExpression(
            types.memberExpression(
              id,
              types.identifier('prototype')
            ), method.key
          )
          let functionExpression = types.functionExpression(
            null,
            method.params,
            method.body
          )
          let assignmentExpression = types.assignmentExpression(
            '=',
            memberExpression,
            functionExpression
          )
          nodes.push(assignmentExpression)
        }
      })

      if (nodes.length === 1) {
        // 单节点用 replaceWith
        path.replaceWith(nodes[0])
      } else {
        // 多节点用 replaceWithMultiple
        path.replaceWithMultiple(nodes)
      }
    }
  }
}

let sourceCode = `
class Person {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(this.name);
  }
}
`

let targetSource = core.transform(sourceCode, {
  plugins: [transformClassesPlugin2]
})

console.log(targetSource.code)