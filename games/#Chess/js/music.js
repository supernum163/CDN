let instance

// 统一的音效管理器
export default class Music {
  constructor() {
    if ( instance )
      return instance
    instance = this

    // 背景音乐资源管理
    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src  = 'audio/bgm.mp3'

    this.playBgm()
  }

  // 播放背景音乐
  playBgm() {
    this.bgmAudio.play()
  }

}
