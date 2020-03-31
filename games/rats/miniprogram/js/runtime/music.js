let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if ( instance )
      return instance
    instance = this

    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src  = 'audio/bgm.mp3'

    this.boom11Audio = new Audio()
    this.boom11Audio.src = 'audio/11.wav'
    this.boom12Audio = new Audio()
    this.boom12Audio.src = 'audio/12.wav'
    this.boom14Audio = new Audio()
    this.boom14Audio.src = 'audio/14.wav'
    this.boom15Audio = new Audio()
    this.boom15Audio.src = 'audio/15.wav'
    this.boom17Audio = new Audio()
    this.boom17Audio.src = 'audio/17.wav'
    this.boom18Audio = new Audio()
    this.boom18Audio.src = 'audio/18.wav'
    this.boom19Audio = new Audio()
    this.boom19Audio.src = 'audio/19.wav'

    this.missAudio = new Audio()
    this.missAudio.src = 'audio/10.wav'

    this.playBgm()
  }

  playBgm() {
    this.bgmAudio.play()
  }

  stopBgm() {
    this.bgmAudio.pause()
  }

  playBoom(id) {
    if (id === 11) {
      this.boom11Audio.currentTime = 0
      this.boom11Audio.play()
    } else if (id === 12) {
      this.boom12Audio.currentTime = 0
      this.boom12Audio.play()
    } else if (id === 14) {
      this.boom14Audio.currentTime = 0
      this.boom14Audio.play()
    } else if (id === 15) {
      this.boom15Audio.currentTime = 0
      this.boom15Audio.play()
    } else if (id === 17) {
      this.boom17Audio.currentTime = 0
      this.boom17Audio.play()
    } else if (id === 18) {
      this.boom18Audio.currentTime = 0
      this.boom18Audio.play()
    } else if (id === 19) {
      this.boom19Audio.currentTime = 0
      this.boom19Audio.play()
    } 
  }

  playMiss() {
    this.missAudio.currentTime = 0
    this.missAudio.play()
  }

}
