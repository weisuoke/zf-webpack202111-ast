// babel 核心模块
const core = require('@babel/core')
// 用来生成或者判断节点的 AST 语法树的节点
const types = require('@babel/types')
const arrowFunctionPlugin = require('babel-plugin-transform-es2015-arrow-functions');
const arrowFunctionPlugin2 = {
  visitor: {
    // 如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
    ArrowFunctionExpression(path) {
      let node = path.node
      hostFunctionEnvironment(path);
      node.type = 'FunctionExpression';
    }
  }
}

/**
 * 1. 要在函数的外面声明一个 _this 变量，值是 this
 * 2. 在函数内部，把 this 指向 _this
 * @param path
 */
function hostFunctionEnvironment(path) {
  // 确定我的 this 变量在哪个环境里生成，向上查找，是普通函数或者是根节点
  const thisEnvFn = path.findParent(parent => {
    return (parent.isFunction() && !path.isArrowFunctionExpress()) || parent.isProgram()
  })
  let thisBindings = "_this";
  if (!thisEnvFn.scope.hasBinding(thisBindings)) {
    thisEnvFn.scope.push({
      id: types.identifier(thisBindings),
      init: types.thisExpression()  // this
    })
  }
  // 替换 this
  let thisPaths = getScopeInfo(path)
  thisPaths.forEach(thisPath => {
    // 把 this 替换成 _this
    thisPath.replaceWith(types.identifier(thisBindings))
  })
}

function getScopeInfo(path) {
  let thisPaths = [];
  path.traverse({
    ThisExpression(path) {
      thisPaths.push(path)
    }
  })
  return thisPaths
}

let sourceCode = `
const sum = (a, b) => {
  console.log(this)
  return a + b;
}
`

let targetSource = core.transform(sourceCode, {
  plugins: [arrowFunctionPlugin2]
})

console.log(targetSource.code)