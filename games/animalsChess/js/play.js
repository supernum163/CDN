
import Music from "music.js"
import Board from "board.js"

// 游戏主函数
export default class Play {
  constructor() {
    this.music = new Music()
    this.board = new Board()
    // 游戏阶段，0 表示起始界面；1 表示下棋过程；2 表示下棋结束；3 表示比赛结果界面
    this.stage = 0
    // 全局帧动画
    this.aniId = 0
    this.draw = this.drawLoop.bind(this)
    this.draw()
    // 绑定触摸事件处理函数
    this.touch = this.touchHandler.bind(this)
    canvas.addEventListener('touchstart', this.touch)
    canvas.addEventListener('touchmove', this.touch)
    canvas.addEventListener('touchend', this.touch)
  }

  drawLoop() {
    if (this.stage === 0) this.board.drawInit()
    else if (this.stage === 3) this.board.drawResult()
    else this.board.draw()
    this.aniId = window.requestAnimationFrame(this.draw, canvas)
  }

  touchHandler(e) {
    e.preventDefault()

    if (e.type === "touchstart") {
      var X = e.touches[0].clientX
      var Y = e.touches[0].clientY
      // 如果背景音乐意外停止，再次点击时重新播放
      // this.music.playBgm()

      // 游戏起始界面，允许调整先后手及难易度
      if (this.stage === 0) {
        if (this.board.changeSettings(X, Y) != null) return
        // 点击 “开始游戏”
        this.board.init()
        this.stage = 1
        if (!this.board.offensive)
          this.board.autoGo()
      }
      // 游戏结束时，点击绘制比赛结果
      else if (this.stage === 2) {
        this.stage = 3
      }
      // 比赛结果界面，或者玩家点击了重新开始按钮
      else if (this.stage === 3 || (this.stage === 1 && this.board.restart(X, Y))) {
        this.stage = 0
      }
      // 将像素点转化为棋格坐标
      else {
        var pos = this.board.transPos(X, Y)
        if (pos.length != 2) return
        // 记录 “正在移动的棋子”
        var chess = this.board.getChess(pos[0], pos[1])
        if (chess === 0) return
        if (chess != 9 && parseInt(chess / 10) != this.board.camp) return
        this.board.movingChess = [pos[0], pos[1], chess, X, Y]
        this.board.setChess(pos[0], pos[1], 1)
      }
    }

    // 如果不在下棋界面，或者没有 “正在移动的棋子”，则直接返回
    var mvChess = this.board.movingChess
    if (this.stage != 1 || mvChess.length != 5) return

    if (e.type === "touchmove") {
      this.board.movingChess[3] = e.touches[0].clientX
      this.board.movingChess[4] = e.touches[0].clientY
      return
    }

    if (e.type === "touchend") {
      this.board.movingChess[3] = e.changedTouches[0].clientX
      this.board.movingChess[4] = e.changedTouches[0].clientY

      // 玩家走棋
      if (!this.board.playerGo()) {
        this.board.setChess(mvChess[0], mvChess[1], mvChess[2])
        this.board.movingChess = []
        return
      }
      // 玩家走棋成功之后，也要清除 “正在移动的棋子”
      this.board.movingChess = []

      // 自动走棋
      var result = this.board.check()
      if (result === null) {
        this.board.autoGo()
        result = this.board.check()
      }
      
      // 判断胜负
      if (result != null) {
        this.board.result = result
        this.stage = 2
        return
      }
    }
  }

}
