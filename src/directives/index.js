// 复制管理所有的自定义指令
export const imagerror = {
  // 指令对象会在当前dom元素插入到节点后执行
  inserted(el, options) {
    // el表示当前指令作用的dom对象
    // 即el此时就是图片
    // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发一个图片的一个事件 => onerror
    el.onerror = function() {
      // el可以注册error事件
      el.src = options.value // 这里不能写死
    }
  }
}
