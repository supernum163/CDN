
import Images from '../base/images.js'
import Audios from '../base/audios.js'
import Adapt from '../base/adapt.js'
import Ball from 'ball.js'

export default class Cue extends Ball {
  constructor() { super() }
  
  init(x, y, radius, weight) {
    super.init(x, y, radius, weight, 'cue')
    this.touches = 0
    this.forth = 0
    this.setAngle()
  }

  setAngle(X = Adapt.w0, Y = Adapt.h0) {
    var xdist = X - this.x
    var ydist = Y - this.y
    this.angle = Math.atan(ydist / xdist)
    if (xdist < 0) this.angle += Math.PI
  }

  onTouch(touch) {
    if (Math.abs(this.x - touch.clientX) > this.radius ||
      Math.abs(this.y - touch.clientY) > this.radius
    ) return false
    return true
  }
  
  update() {
    if (this.touches > 0) {
      this.forth = this.forth % 3 + 0.01
    } else {
      this.x += this.xSpeed
      this.y += this.ySpeed
    }
  }

  draw(ctx) {
    if (this.touches > 0) {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(this.angle)
      // 绘制弹力
      ctx.lineWidth = this.radius
      ctx.strokeStyle = 'red'
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(this.radius + this.radius * this.forth, 0)
      ctx.stroke()
      // 绘制箭头
      ctx.drawImage(Images['arrow'],
        0, -this.radius, this.radius * 6, this.radius * 2
      )
      ctx.restore()
    }
    //绘制弹珠
    super.draw(ctx)
  }



  handleTouch(e) {
    if (e.type === 'touchstart') {
      var touchOn = this.onTouch(e.touches[0]) 
      if (this.touches === 0 && touchOn) {
        this.touches = 1
      } else if (this.touches === 1) {
        this.touches = 2
      } 
    } else if (e.type === 'touchmove') {
      var touchOn = this.onTouch(e.touches[0])
      if (this.touches === 1 && !touchOn) {
          this.xSpeed = 0
          this.ySpeed = 0
          this.setAngle()
          this.touches = 0
      } else if (this.touches === 2 && !touchOn) {
        this.xSpeed = this.forth * Math.cos(this.angle)
        this.ySpeed = this.forth * Math.sin(this.angle)
        this.touches = 0
      } else if (touchOn && e.touches.length > 1) {
        this.setAngle(e.touches[1].clientX, e.touches[1].clientY)
      }
    } else if (e.type === 'touchend') {
      var touchOn = this.onTouch(e.changedTouches[0])
      if (this.touches === 1 && touchOn) {
        this.xSpeed = 0
        this.ySpeed = 0
        this.setAngle()
        this.touches = 0
      } if (this.touches === 2 && touchOn) {
        this.xSpeed = this.forth * Math.cos(this.angle)
        this.ySpeed = this.forth * Math.sin(this.angle)
        this.touches = 0
      } else if (this.touches === 2) {
        this.touches = 1
      }
    } 
  }
}
