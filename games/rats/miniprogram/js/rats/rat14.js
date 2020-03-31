
export default class Rat14 {
  constructor(frameId, posId) {
    this.imageId = 14
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
    play.music.playBoom(14)
    play.skull -= 1
    this.recycle(play)
    play.R.forEach(r => {
      if (!r.show || r.imageId === 14) return
      r.recycle(play)
      play.score -= 1
    })
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