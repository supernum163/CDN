
import Images from '../base/images.js'
import Adapt from '../base/adapt.js'
import Ball from '../balls/ball.js'
import Cue from '../balls/cue.js'
import Hole from '../balls/hole.js'

export default class Level0 {
  constructor() {
    this.levelId = 0
    this.border = Adapt.i * 2
    this.friction = 0.001
    this.hole = new Hole()
    this.cue = new Cue()
    this.balls = [this.cue, new Ball()]
    this.init()
  }

  init() {
    this.hole.init(Adapt.w0, Adapt.H / 3, Adapt.i * 8)
    this.cue.init(Adapt.w0, Adapt.H * 3 / 4, Adapt.i * 6, 1)
    // this.cue.xSpeed = 2
    // this.cue.ySpeed = 0.5
    this.balls[1].init(Adapt.w0, Adapt.H / 2, Adapt.i * 6, 1, 'ball1')
  }

  draw(ctx) {
    // 清除画面
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 背景颜色
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, Adapt.W, Adapt.H)
    ctx.fillStyle = 'burlywood'
    ctx.fillRect(0, 0, this.border, Adapt.H)
    ctx.fillRect(0, 0, Adapt.W, this.border)
    ctx.fillRect(Adapt.W - this.border, 0, this.border, Adapt.H)
    ctx.fillRect(0, Adapt.H - this.border, Adapt.W, this.border)
    // 弹珠与洞
    this.hole.draw(ctx)
    this.balls.forEach(b => b.draw(ctx))
  }

  update() {
    for (var i = 0; i < this.balls.length; i++) {
      var b = this.balls[i]
      if (!b.show) return
      // 普通移动
      b.update()
      // 模拟摩擦力
      var speed = Math.sqrt(b.xSpeed ** 2 + b.ySpeed ** 2)
      if (speed < this.friction) {
        b.xSpeed = 0
        b.ySpeed = 0
      } else {
        b.xSpeed -= this.friction * b.xSpeed / speed
        b.ySpeed -= this.friction * b.ySpeed / speed
      }
      // 边缘反弹
      if (b.x - b.radius < this.border ||
        b.x + b.radius > Adapt.W - this.border
      ) b.xSpeed *= -1
      if (b.y - b.radius < this.border ||
        b.y + b.radius > Adapt.H - this.border
      ) b.ySpeed *= -1
      // 模拟碰撞
      for (var j = i + 1; j < this.balls.length; j++) 
        b.hit(this.balls[j])
      // 判断是否 “进洞”
      if (this.hole.hit(this.balls[i])) return i > 0 ? 1 : 2
    }
    return 0 
  }

}