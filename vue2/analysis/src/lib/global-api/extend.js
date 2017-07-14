/* @flow */

import { ASSET_TYPES } from '../shared/constants'

export function initExtend(Mue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Mue.cid = 0
  let cid = 1

}
