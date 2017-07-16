let uid = 0

export default function Dep() {
  this.id = uid++;
  this.subs = [];
}