// babel 核心模块
const core = require('@babel/core')
// 用来生成或者判断节点的 AST 语法树的节点
let types = require('@babel/types')

const visitor = {
  CallExpression(path) {
    if (types.isMemberExpression(path.node.callee)) {
      if (path.node.callee.object.name === 'console') {
        if (['log', 'info', 'warn', 'error', 'debug'].includes(path.node.callee.property.name)) {
          const { line, column } = path.node.loc.start;
          path.node.arguments.unshift(types.stringLiteral(`${line}:${column}`))
        }
      }
    }
  }
}

module.exports = function () {
  return {
    visitor
  }
}