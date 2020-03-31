
import Images from "images.js"
import {autoGo0, autoGo1} from "autoGo.js"

let ctx = canvas.getContext('2d')
ctx.strokeStyle = 'black'
ctx.textAlign = 'center'
ctx.textBaseline = 'middle'

const W = window.innerWidth
const H = window.innerHeight

export default class Board {
  constructor(offensive = true, difficulty = 0) {
    // 记录棋盘起始位置及棋格宽度
    this.w0 = 5
    this.h0 = (H - W) / 2 + 5
    this.w = (W - 5) / 4
    this.cellW = this.w - 5
    this.hFooter = this.h0 * 1.5 + this.w * 4
    // 记录棋盘中所有的棋格
    this.positions = [
      [0, 0], [0, 1], [0, 2], [0, 3],  [1, 0], [1, 1], [1, 2], [1, 3],
      [2, 0], [2, 1], [2, 2], [2, 3],  [3, 0], [3, 1], [3, 2], [3, 3]
    ]
    // 自动走棋机器人
    this.autoGo0 = autoGo0.bind(this)
    this.autoGo1 = autoGo1.bind(this)

    // 先后手与难易度
    this.offensive = offensive
    this.difficulty = difficulty

    this.init()
  }

  // 重置棋盘
  init() {
    // 根据难易度匹配机器人
    this.autoGo = [this.autoGo0, this.autoGo1][this.difficulty]
    // 棋格中：0 表示没有棋子；9 表示未翻开的棋子
    //  10至17 表示黑方棋子；20至27 表示红方棋子
    this.board = [
      [9, 9, 9, 9],
      [9, 9, 9, 9],
      [9, 9, 9, 9],
      [9, 9, 9, 9],
    ]
    // 每局重置时16个未翻开的棋子
    this.chesses = [
      10, 11, 12, 13, 14, 15, 16, 17, 
      20, 21, 22, 23, 24, 25, 26, 27, 
    ]
    // 玩家当前拖动的棋子，格式为 [i, j, chess, x, y]
    this.movingChess = []
    // 玩家阵营：1 表示黑色；2 表示红色
    this.camp = 0
    // 比赛结果，0 表示和局；1 表示恭喜获胜；2 表示挑战失败
    this.result = null
    // 帧动画管理
    this.aniId = 0
  }

  // 根据位置获取棋子
  getChess(i, j) {
    if (i < 0 || i > 3 || j < 0 || j > 3)
      return null
    return this.board[i][j]
  }

  // 根据位置修改棋子
  setChess(i, j, chess) {
    if (i < 0 || i > 3 || j < 0 || j > 3)
      return false
    this.board[i][j] = chess
    return true
  }

  // 判断将第一个棋子移动到第二个位置后的 “得分”
  scoreOfMove(i1, j1, chess1, i2, j2) {
    // 判断两个位置是否 “不近邻”
    if (Math.abs(i1 - i2) + Math.abs(j1 - j2) != 1) return -9
    // 获取第二个位置上的棋子
    var chess2 = this.getChess(i2, j2)
    // 判断第二个棋子是否未翻开，或两个棋子属于同一个阵营
    if (chess2 === null || chess2 === 9 ||
      parseInt(chess1 / 10) === parseInt(chess2 / 10)
    ) return -9
    // 判断第二个位置上是否没有棋子
    if (chess2 === 0) return 0.1
    // 判断移动后的 “得分”
    var chess1 = chess1 % 10; var chess2 = chess2 % 10
    if (chess1 === 7 && chess2 === 0) return -7
    if (chess1 === 0 && chess2 === 7) return 7
    if (chess1 === chess2) return 0
    return chess1 > chess2 ? chess2 + 1 :-chess1 - 1
  }

  // 将棋子翻面，或者从一个位置移动到另一个位置
  moveChess(i1, j1, chess1, i2, j2, playerGo) {
    // 将棋子翻面
    if (chess1 === 9) {
      if (i1 != i2 || j1 != j2) return false
      var i = parseInt(Math.random() * this.chesses.length)
      var chess = this.chesses.splice(i, 1)[0]
      this.setChess(i1, j1, chess)
      // 判断玩家阵营是否确立
      if (this.camp === 0)
        this.camp = (parseInt(chess / 10) + playerGo) % 2 + 1
      return true
    }
    // 将棋子从一个位置移动到另一个位置
    var score = this.scoreOfMove(i1, j1, chess1, i2, j2)
    // 判断第一个棋子是否能和第二个棋子 “同归于尽”
    if (score === 0) {
      this.setChess(i1, j1, 0)
      this.setChess(i2, j2, 0)
      return true
    }
    // 判断第一个棋子是否能走到第二个位置
    if (score > 0) {
      this.setChess(i1, j1, 0)
      this.setChess(i2, j2, chess1)
      return true
    }
    // 其它情况，如第一个棋子无法走到第二个位置
    return false
  }

  // 判断是否有一方获胜，null 表示挑战继续，0 表示和局；1 表示恭喜获胜，2 表示挑战失败
  check() {
    // 获取棋盘中 “存活” 的棋子
    var survivors = []
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (this.board[i][j] === 9) return null
        if (this.board[i][j] === 0) continue
        survivors.push([i, j, this.board[i][j]])
      }
    }
    // 判断黑色和红色是否有一方无路可走
    var canMove = 0
    for (var k = 0; k < survivors.length; k++) {
      var i = survivors[k][0]; var j = survivors[k][1]
      var chess = survivors[k][2]
      if (canMove === parseInt(chess / 10)) continue
      var directions = [[i - 1, j], [i + 1, j], [i, j + 1], [i, j - 1]]
      while (directions.length > 0) {
        var pos = directions.splice(0, 1)[0]
        if (this.scoreOfMove(i, j, chess, pos[0], pos[1]) < 0) continue
        canMove += parseInt(chess / 10)
        break
      }
      if (canMove === 3) break
    }
    if (canMove === 0) return 0
    if (canMove === this.camp) return 1
    if (canMove === this.camp % 2 + 1) return 2
    // 如果有两个不同阵营的 “存活” 的棋子，且无法角逐胜负，则和局
    if (survivors.length === 2 && 
      (survivors[0][0] + survivors[0][1] - survivors[1][0] - survivors[1][1]) % 2 === 0
    ) return 0
    // 可以继续下棋
    return null
  }

  // 绘制棋盘
  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 背景颜色
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, W, H)
    // 4 * 4 棋格
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        ctx.drawImage(Images[this.board[i][j]],
          this.w0 + this.w * i, this.h0 + this.w * j,
          this.cellW, this.cellW
        )
      }
    }
    // 玩家阵营与重新开始按钮
    ctx.drawImage(Images["camp" + this.camp],
      W / 2 - 97, this.hFooter - 30, 194, 60
    )
    // 玩家当前拖动的棋子
    if (this.movingChess.length === 5) {
      ctx.drawImage(Images[this.movingChess[2]],
        this.movingChess[3] - this.cellW / 2,
        this.movingChess[4] - this.cellW / 2,
        this.cellW, this.cellW
      )
    }
  }

  // 将像素点转化为棋格坐标
  transPos(X, Y) {
    if (X < this.w0 || Y < this.h0) return []
    var i = parseInt((X - this.w0) / this.w)
    var j = parseInt((Y - this.h0) / this.w)
    if (i > 3 || j > 3) return []
    return [i, j]
  }

  // 玩家走棋
  playerGo() {
    // 获取 “正在移动的棋子”
    var m = this.movingChess
    if (m.length != 5) return false
    // 将像素点转化为棋格坐标
    var pos = this.transPos(m[3], m[4])
    if (pos.length != 2) return false
    // 移动棋子
    return this.moveChess(m[0], m[1], m[2], pos[0], pos[1], true)
  }

  // 判断玩家是否点击了重新开始按钮
  restart(X, Y) {
    if (X > W / 2 - 38 && X < W / 2 + 97 &&
      Y > this.hFooter - 30 && Y < this.hFooter + 30
    ) return true
    return false
  }

  // 绘制比赛结果
  drawResult() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 背景颜色
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, W, H)
    // 上下边框
    ctx.beginPath();
    ctx.moveTo(0, H / 2 - 30)
    ctx.lineTo(W, H / 2 - 30)
    ctx.moveTo(0, H / 2 + 30)
    ctx.lineTo(W, H / 2 + 30)
    ctx.stroke();
    // 是否挑战成功
    ctx.font = 'bold 40px monospace'
    ctx.fillStyle = "red"
    var msg = ["和局", "恭喜获胜", "挑战失败"][this.result]
    ctx.fillText(msg, W / 2, H / 2)
  }

  // 绘制开始界面
  drawInit() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 背景颜色
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, W, H)
    // 游戏标题
    ctx.font = 'bold 60px monospace'
    ctx.fillStyle = "red"
    ctx.fillText("斗兽棋", W / 2, H / 2 - 150)
    // 先后手按钮
    ctx.font = '40px monospace'
    ctx.strokeRect(10, H / 2 - 60, W - 20, 60)
    ctx.fillText(this.offensive ? "先手" : "后手", W / 2, H / 2 - 30)
    // 难易度按钮
    ctx.strokeRect(10, H / 2 + 10, W - 20, 60)
    ctx.fillText(this.difficulty === 0 ? "简单" : "普通", W / 2, H / 2 + 40)
    // 开始按钮
    ctx.strokeRect(10, H / 2 + 100, W - 20, 60)
    ctx.fillText("开始游戏", W / 2, H / 2 + 130)
  }

  // 修改游戏设定
  changeSettings(X, Y) {
    // 修改难易度
    if (X > 10 && X < W - 10 && Y > H / 2 - 60 && Y < H / 2) {
      this.offensive = !this.offensive
      return true
    }
    // 修改先后手
    if (X > 10 && X < W - 10 && Y > H / 2 + 10 && Y < H / 2 + 70) {
      this.difficulty = (this.difficulty + 1) % 2
      return true
    }
    // 点击开始游戏
    if (X > 10 && X < W - 10 && Y > H / 2 + 100 && Y < H / 2 + 160) 
      return null
    return false
  }

}