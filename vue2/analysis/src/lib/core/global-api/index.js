import { ASSET_TYPES } from 'shared/constants'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import {
  extend,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI(Mue) {
  var configDef = {};
  configDef.get = function () {
    return config;
  };

  configDef.set = function () {
    console.log(
      'Do not replace the Vue.config object, set individual fields instead.'
    );
  };

  Object.defineProperty(Mue, 'config', configDef);


  Mue.util = {
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  }

  Mue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Mue.options[type + 's'] = Object.create(null);
  });

  Mue.options._base = Mue;

  initExtend(Mue)
  initAssetRegisters(Mue)
}
