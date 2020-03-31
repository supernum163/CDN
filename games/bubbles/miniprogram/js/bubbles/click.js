
import Adapt from "../base/adapt.js"
import Util from "../base/util.js"

export default class Click {
  constructor(X, Y, imageId) {
    // 气泡对应图片
    this.imageId = imageId
    // 回收时需要重置的内容
    this.init(X, Y)
  }

  init(X, Y) {
    // 是否展示图片
    this.show = true
    // 触摸开始时间
    this.TStime = null
    // 气泡初始位置、移动方向、初始尺寸、爆破尺寸
    this.x = X
    this.y = Y
    this.xdict = 0
    this.ydict = 1
    this.radius = 1
    this.limit = Util.random(30, 100)
  }

  grow(play) {
    // 点击戳破与每次增长加减金币
    if (!this.show) {
      if (this.TStime === null) return
      play.money += this.radius * 25
      this.TStime = null
      return
    }
    // 气泡增长时的颜色变换与特效
    if (this.radius > this.limit - 5 && this.imageId < 100) {
      this.imageId += 100
    } else if (this.radius > this.limit) {
      // 自然增长至破裂，无视是否长按
      play.audio.playBoom(0)
      play.money -= this.radius * 50
      this.show = false
      this.TStime = null
    } 
  }

}