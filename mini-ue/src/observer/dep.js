import {toArray} from '../util/index'

let uid = 0


/**
 * dep 是一个可观察量
 * 可以被多个指定订阅
 */
export default function Dep () {
  this.id = uid++
  this.subs = []
}