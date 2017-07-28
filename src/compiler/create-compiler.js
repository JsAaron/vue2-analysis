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

    /**
     * 真正的编译方法
     */
    function compile(template, options) {

      var finalOptions = Object.create(baseOptions)
      var errors = [];
      var tips = [];
      finalOptions.warn = function(msg, tip) {
        (tip ? tips : errors).push(msg)
      };

      if (options) {
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions)

      return compiled
    }

    return {
      compile,
      //编译函数方法，内部会调用compile进行处理
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }

}