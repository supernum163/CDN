
import { choose } from "../base/utils.js"

export default class Rat18 {
  constructor(frameId, posId) {
    this.imageId = 18
    this.init(frameId, posId)
  }

  init(frameId, posId) {
    this.show = true
    this.frameId = frameId
    this.posId = posId
  }

  recycle(play) {
    this.show = false
    play.rats[this.posId] = 0
  }

  onHit(play) {
    play.music.playBoom(18)
    play.skull -= 1
    this.recycle(play)
    for (var i = 0; i < 2; i++) {
      var positions = play.avilPos()
      if (positions.length === 0) return
      var posId = choose(positions)
      play.add(posId)
    }
  }

  update(play) {
    if (!this.show) return
    if (play.frameId - this.frameId > 60) {
      play.music.playMiss()
      play.life -= 1
      this.recycle(play)
    }
  }

}