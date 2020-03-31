
import Adapt from '../base/adapt.js'

export default class Fire {
  constructor(X, Y) {
    this.x = X
    this.y = Y
    this.xSpeed = 1
    this.ySpeed = -2
    this.path = []
    this.show = true
  }

  update() {
    if (this.x > 0 && this.y > 0 &&
      this.x < Adapt.W && this.y < Adapt.H
    ) { 
      this.path.unshift({ x: this.x, y: this.y })
    } else {
      this.show = false
    }
    if (this.path.length > 10 || !this.show) 
      this.path.pop()
    this.x += this.xSpeed
    this.y += this.ySpeed
    this.ySpeed += 0.01
  }

  draw(ctx) {
    ctx.fillStyle = 'rgba(128, 128, 128, 0.5)'
    for(var p of this.path) {
      ctx.fillRect(p.x, p.y, 2, 2)
    }
    if (!this.show) return
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }

}