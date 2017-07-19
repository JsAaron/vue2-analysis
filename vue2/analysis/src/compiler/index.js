import { parse } from './parser/index'
import { createCompilerCreator } from './create-compiler'

/**
 * compileToFunctions => compile => baseCompile
 */
function baseCompile(template, options) {
  const ast = parse(template.trim(), options)
  // optimize(ast, options)
  // const code = generate(ast, options)
  // return {
  //   ast,
  //   render: code.render,
  //   staticRenderFns: code.staticRenderFns
  // }
}

export const createCompiler = createCompilerCreator(baseCompile)