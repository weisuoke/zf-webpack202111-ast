// babel 核心模块
const core = require('@babel/core')
// 用来生成或者判断节点的 AST 语法树的节点
let types = require('@babel/types')

const visitor = {
  ImportDeclaration(path, state) {
    const { node } = path;  // 获取节点
    const { specifiers } = node;  // 获取批量导入声明数组
    const { libraryName } = state.opts; // 获取选项中的支持的库的名称
    // 如果当前的节点的模块名称是我们需要的库的名称
    if (node.source.value === libraryName
      && !types.isImportDefaultSpecifier(specifiers[0]) // 并且不是默认导入
    ) {
      // 遍历批量导入声明数组
      const declarations =  specifiers.map(specifier => {
        // 返回一个 importDeclaration 节点
        return types.importDeclaration(
          // 导入声明 importDefaultSpecifier flatten
          [types.importDefaultSpecifier(specifier.local)],
          // 导入模块source lodash/flatten
          types.stringLiteral(`${libraryName}/${specifier.imported.name}`)
        )
      })
      path.replaceWithMultiple(declarations); // 替换当前节点
    }
  }
}

module.exports = function () {
  return {
    visitor
  }
}