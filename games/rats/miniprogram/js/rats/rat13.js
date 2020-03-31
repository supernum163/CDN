
export default class Rat13 {
  constructor(frameId, posId) {
    this.imageId = 13
    this.init(frameId, posId)
  }

  init(frameId, posId) {
    this.show = true
    this.frameId = frameId
    this.posId = posId
    this.life = 3
  }

  recycle(play) {
    this.show = false
    play.rats[this.posId] = 0
  }

  onHit(play) {
    this.life -= 1
    play.rats[this.posId] -= 1
    if (this.life <= 0) {
      play.music.playBoom(11)
      play.skull -= 1
      this.recycle(play)
    } else {
      play.music.playBoom(12)
    }
  }

  update(play) {
    if (!this.show) return
    if (play.frameId - this.frameId > 120) {
      play.music.playMiss()
      play.life -= 1
      this.recycle(play)
    }
  }

}