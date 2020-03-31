
let instance

export default class Audios {
  constructor() {
    if ( instance )
      return instance
    instance = this

    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src  = 'audio/bgm.mp3'

    this.boom0Audio = new Audio()
    this.boom0Audio.src = 'audio/0.wav'
    this.boom1Audio = new Audio()
    this.boom1Audio.src = 'audio/1.wav'
    this.boom2Audio = new Audio()
    this.boom2Audio.src = 'audio/2.wav'
    this.boom3Audio = new Audio()
    this.boom3Audio.src = 'audio/3.wav'

    this.playBgm()
  }

  playBgm() {
    this.bgmAudio.play()
  }

  stopBgm() {
    this.bgmAudio.pause()
  }

  playBoom(id) {
    if (id === 0) {
      this.boom0Audio.currentTime = 0
      this.boom0Audio.play()
    } else if (id === 1) {
      this.boom1Audio.currentTime = 0
      this.boom1Audio.play()
    } else if (id === 2) {
      this.boom2Audio.currentTime = 0
      this.boom2Audio.play()
    } else if (id === 3) {
      this.boom3Audio.currentTime = 0
      this.boom3Audio.play()
    }
  }

}
