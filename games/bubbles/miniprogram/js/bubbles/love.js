
import Adapt from "../base/adapt.js"

export default class Love {
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
    this.limit = [Adapt.W_6, Adapt.W_4, Adapt.W_3]
  }

  grow(play) {
    if (!this.show) return
    // 每次增长耗费金币
    if (this.radius > 25) 
      play.money -= 40e4 / (this.limit[2] / 0.05)
    // 气泡特效与增加金币
    if (this.radius > 30 && this.TStime === null) {
      this.show = false
    } else if (this.radius > this.limit[0] - 5 && this.imageId === 30) {
      play.money += 10e4
      this.imageId = 130
    } else if (this.radius > this.limit[0] && this.imageId === 130) {
      this.imageId = 31
    } else if (this.radius > this.limit[1] - 5 && this.imageId === 31) {
      play.money += 20e4
      this.imageId = 131
    } else if (this.radius > this.limit[1] && this.imageId === 131) {
      this.imageId = 32
    } else if (this.radius > this.limit[2] - 5 && this.imageId === 32) {
      play.money += 30e4
      this.imageId = 132
    } else if (this.radius > this.limit[2]) {
      play.audio.playBoom(0)
      this.show = false
      this.TStime = null
    } 
  }

}