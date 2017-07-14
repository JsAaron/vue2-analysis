/* @flow */

import { ASSET_TYPES } from '../shared/constants'
import { extend, mergeOptions } from '../util/index'

export function initExtend(Mue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Mue.cid = 0
  let cid = 1

  Mue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var Sub = function MueComponent(options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );

    Sub['super'] = Super;

    Sub.extend = Super.extend;
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  }

}
