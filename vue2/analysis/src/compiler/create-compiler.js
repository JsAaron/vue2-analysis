

import { createCompileToFunctionFn } from './to-function'


/**
 * createCompiler
 *   compile
 *
 *   functionCompileCache
 *   compileToFunctions
 */
export function createCompilerCreator(baseCompile) {

  return function createCompiler(baseOptions) {


    function compile(template, options) {
      const compiled = function(){}
      return compiled
    }

    return {
      compile,
      //编译函数方法，内部会调用compile进行处理
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }

}