
import { choose } from "../base/utils.js"

export default class Rat17 {
  constructor(frameId, posId) {
    this.imageId = 17
    this.init(frameId, posId)
  }

  init(frameId, posId) {
    this.show = true
    this.frameId = frameId
    this.posId = posId
    this.life = 2
  }

  recycle(play) {
    this.show = false
    play.rats[this.posId] = 0
  }

  onHit(play) {
    this.life -= 1
    if (this.life <= 0) {
      play.music.playBoom(11)
      play.skull -= 1
      this.recycle(play)
    } else {
      play.music.playBoom(17)
      var positions = play.avilPos()
      if (positions.length === 0) return
      var posId = choose(positions)
      play.rats[this.posId] = 0
      play.rats[posId] = this.imageId
      this.posId = posId
    }

  }

  update(play) {
    if (!this.show) return
    if (play.frameId - this.frameId > 90) {
      play.music.playMiss()
      play.life -= 1
      this.recycle(play)
    }
  }

}