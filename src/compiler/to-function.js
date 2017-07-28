export function createCompileToFunctionFn(compile) {
  const cache = Object.create(null);
  return function compileToFunctions(template, options, vm) {
    options = options || {};
    var compiled = compile(template, options);
    const res = {}
    return res
  }
}