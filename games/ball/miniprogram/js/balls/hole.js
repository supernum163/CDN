
import Images from '../base/images.js'
import Audios from '../base/audios.js'

export default class Hole {
  constructor() {}

  init(x, y, radius) {
    this.x = x
    this.y = y
    this.radius = radius
    this.imageId = 'hole'
  }

  hit(ball) {
    if (Math.abs(this.x - ball.x) < this.radius &&
      Math.abs(this.y - ball.y) < this.radius
    ) return true
    return false
  }

  draw(ctx) {
    ctx.drawImage(Images[this.imageId],
      this.x - this.radius, this.y - this.radius,
      this.radius * 2, this.radius * 2
    )
  }

}