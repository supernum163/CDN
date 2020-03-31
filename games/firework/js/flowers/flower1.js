
import Util from '../base/util.js'
import Adapt from '../base/adapt.js'

export default class Flower1 {
  constructor(X, Y) {
    this.layer = 3
    this.petal = []
    for (var i = 1; i < this.layer; i++) {
      var n = Util.random(6 * i, 12 * i)
      var radius = [20, 28][i - 1]
      var degree = Math.PI * 2 / n
      for (var j = 0; j < n; j++) {
        var x = radius * Math.sin(degree * j) + Math.random() * 4 * i
        var y = radius * Math.cos(degree * j) + Math.random() * 4 * i
        var r = Util.random(2, 4)
        this.petal.push({ x: x, y: y, r: r })
      }
    }
    this.init(X, Y)
  }

  init(X, Y) {
    this.x = X
    this.y = Y
    this.color = 'rgba(' + Util.random(128, 255) + ', ' +
      Util.random(128, 255) + ', ' + Util.random(128, 255) + ', 0.5)'
    this.show = true
  }

  draw(ctx) {
    if (!this.show) return
    // 花芯
    var radius = 28
    var grd = ctx.createRadialGradient(
      this.x, this.y, 1,
      this.x, this.y, radius
    )
    grd.addColorStop(0, 'white')
    grd.addColorStop(0.2, 'rgba(128, 128, 128, 0.5)')
    grd.addColorStop(1, 'rgba(0, 0, 0, 0.5)')
    ctx.fillStyle = grd
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2)
    /*
    ctx.fillStyle = this.color
    ctx.arc(this.x + 6, this.y + 6, 6, 0, Math.PI * 2)
    */
    ctx.closePath()
    ctx.fill()

    // 花瓣
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
    ctx.lineWidth = 1
    for (var p of this.petal) {
      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      if (p.y < 0) {
        ctx.bezierCurveTo(this.x + p.x / 2, this.y, 
          this.x, this.y + p.y / 2, 
          this.x + p.x, this.y + p.y
        )
      } else {
        ctx.bezierCurveTo(this.x, this.y + p.y / 2,
          this.x + p.x / 2, this.y,
          this.x + p.x, this.y + p.y
        )
      }
      //ctx.lineTo(this.x + p.x, this.y + p.y)
      //ctx.closePath()
      ctx.stroke()
      ctx.fillRect(this.x + p.x, this.y + p.y, p.r, p.r)
    }
  }

}