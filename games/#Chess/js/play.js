
import Board from "board.js"
import Music from "music.js"

export default class Play {
  constructor() {
    // 播放北京音乐
    this.music = new Music()
    // 绘制起始界面
    this.board = new Board(0, 1)
    this.board.drawInit()
    this.stage = 0
    // 循环重新开始
    canvas.addEventListener('touchstart', this.touch.bind(this))
  }

  // 玩家着棋
  touch(e) {
    e.preventDefault()
    let X = e.touches[0].clientX
    let Y = e.touches[0].clientY
    // 如果背景音乐意外停止，再次点击时重新播放
    this.music.playBgm()

    // 开始游戏界面
    if (this.stage === 0) {
      if (this.board.changeSettings(X, Y) != null) return
      // 开始游戏
      this.stage = 1
      this.board.init()
      this.board.draw()
      if (!this.board.offensive)
        this.board.autoGo()
      return
    }
    
    // 下棋界面
    if (this.stage === 1) {
      // 玩家下棋
      if (!this.board.playerGo(X, Y)) return
      var result = this.board.check()
      // 机器人下棋
      if (result === "") {
        this.board.autoGo()
        result =this.board.check()
      }
      // 检查结果
      if (result != "") {
        this.board.result = result
        this.stage = 2
        return
      }
    }

    // 下棋结束，点击回到开始下棋界面
    if (this.stage === 2) {
      window.cancelAnimationFrame(this.board.aniId)
      this.board.drawInit()
      this.stage = 0
      return
    }

  }

}














