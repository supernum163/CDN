
import Images from '../base/images.js'
import Audios from '../base/audios.js'

export default class Ball {
  constructor() {}

  init(x, y, radius, weight, imageId) {
    this.x = x
    this.y = y
    this.radius = radius
    this.weight = weight
    this.imageId = imageId
    this.xSpeed = 0
    this.ySpeed = 0
    this.show = true
  }

  update() {
    this.x += this.xSpeed
    this.y += this.ySpeed
  }

  draw(ctx) {
    ctx.drawImage(Images[this.imageId],
      this.x - this.radius, this.y - this.radius, 
      this.radius * 2, this.radius * 2
    )
  }

  hit(that) {
    if(!this.show || !that.show) return
    
    var xdist = this.x - that.x
    var ydist = this.y - that.y
    var dist = Math.sqrt(xdist ** 2 + ydist ** 2)
    if (dist > this.radius + that.radius) return 

    if (xdist === 0) {
      var speed0 = this.ySpeed + that.ySpeed
      if (this.ySpeed * ydist > 0) {
        this.ySpeed = speed0
        that.ySpeed = 0
      } else {
        this.ySpeed = 0
        that.ySpeed = speed0
      }
    } else if (ydist === 0) {
      var speed0 = this.xSpeed + that.xSpeed
      if (this.xSpeed * xdist > 0) {
        this.xSpeed = speed0
        that.xSpeed = 0
      } else {
        this.xSpeed = 0
        that.xSpeed = speed0
      }
    } else {
      var sin = Math.abs(ydist) / dist
      var cos = Math.abs(xdist) / dist
      var flag = ydist * xdist >= 0 ? 1 : -1
      var speed0 = this.xSpeed * cos + this.ySpeed * sin * flag + 
        that.xSpeed * cos + that.ySpeed * sin * flag 
      var speed1 = this.xSpeed * sin - this.ySpeed * cos * flag 
      var speed2 = that.xSpeed * sin - that.ySpeed * cos * flag 
      if (speed0 * xdist > 0) {
        this.xSpeed = speed1 * sin + speed0 * cos
        this.ySpeed = -flag * speed1 * cos + flag * speed0 * sin
        that.xSpeed = speed2 * sin
        that.ySpeed = -flag * speed2 * cos
      } else {
        this.xSpeed = speed1 * sin
        this.ySpeed = -flag * speed1 * cos
        that.xSpeed = speed2 * sin + speed0 * cos
        that.ySpeed = -flag * speed2 * cos + flag * speed0 * sin
      }
    }
    
  }
  

}