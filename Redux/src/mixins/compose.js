export function Compose(superClass, ...mixins) {
  return mixins.reduce((c, mixin) => mixin(c), superClass);
}
