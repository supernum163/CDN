
import Util from '../base/util.js'
import Adapt from '../base/adapt.js'

export default class Flower0 {
  constructor(X, Y) {
    this.layer = Util.random(4, 6)
    this.petal = []
    for (var i = 1; i < this.layer; i++) {
      var n = [6, 12, 24, 48, 96, 192][i]
      var radius = [4, 12, 24, 40, 60, 76][i]
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
    this.x = X - 3
    this.y = Y - 3
    this.color = 'rgba(' + Util.random(128, 255) + ', ' +
      Util.random(128, 255) + ', ' + Util.random(128, 255) + ', 0.5)'
    this.show = true
  }

  draw(ctx) {
    if (!this.show) return
    // 花芯
    var radius = [40, 60, 76][this.layer - 4]
    var grd = ctx.createRadialGradient(
      this.x + 3, this.y + 3, 1, 
      this.x + 3, this.y + 3, radius
    )
    grd.addColorStop(0, 'white')
    grd.addColorStop(0.2, 'rgba(128, 128, 128, 0.5)')
    grd.addColorStop(1, 'rgba(0, 0, 0, 0.5)')
    ctx.fillStyle = grd
    ctx.arc(this.x + 6, this.y + 6, radius, 0, Math.PI * 2)
    /*
    ctx.fillStyle = this.color
    ctx.arc(this.x + 6, this.y + 6, 6, 0, Math.PI * 2)
    */
    ctx.closePath()
    ctx.fill()

    // 花瓣
    ctx.fillStyle = this.color
    for (var p of this.petal) {
      ctx.fillRect(this.x + p.x, this.y + p.y, p.r, p.r)
    }
  }

}