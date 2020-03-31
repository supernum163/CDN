
export default class Rat11 {
  constructor(frameId, posId) {
    this.imageId = 11
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
    play.music.playBoom(11)
    play.skull -= 1
    this.recycle(play)
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