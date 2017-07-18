import { createCompilerCreator } from './create-compiler'


function baseCompile(template, options) {
  // const ast = parse(template.trim(), options)
  // optimize(ast, options)
  // const code = generate(ast, options)
  // return {
  //   ast,
  //   render: code.render,
  //   staticRenderFns: code.staticRenderFns
  // }
}

export const createCompiler = createCompilerCreator(baseCompile)