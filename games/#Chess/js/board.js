
import { W, H, Points, Lines, Utils } from "utils.js"
import Images from "images.js"

let ctx = canvas.getContext('2d')
ctx.lineWidth = 1
ctx.strokeStyle = 'black'
ctx.textAlign = 'center'
ctx.textBaseline = 'middle'

// 3*3 棋盘
export default class Board {
  constructor(offensive, difficulty) {
    // 玩家的棋子类型， 0 代表 "○"， 1 代表 "×"
    this.offensive = offensive
    // 游戏难度， 0 代表简单， 1 代表困难
    this.difficulty = difficulty

    // 棋盘横纵坐标起止位置
    this.w0 = 5
    this.w1 = W - 5
    this.h0 = (H - W) / 2 + 5
    this.h1 = (H + W) / 2 - 5
    // 棋子距棋格的间距
    this.gap = 25
    // 棋盘边长
    this.w = this.w1 - this.w0
    // 棋格边长
    this.cellW = this.w / 3

    this.init()
  }

  // 重置棋盘
  init() {
    // 初始化棋盘，琦格中的 0 代表代表没有棋子，
    //  1 表示玩家下的棋子，-1 表示机器人下的棋子
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.result = ""
    this.autoGo = [this.autoGo0, this.autoGo1][this.difficulty]
  }

  // 玩家走棋
  playerGo(X, Y) {
    // 将像素点转化为棋格坐标
    var x = parseInt((X - this.w0) / this.cellW)
    var y = parseInt((Y - this.h0) / this.cellW)
    var z = x * 3 + y
    // 判断玩家是否点击了无效棋格
    if (X < this.w0 || Y < this.h0 || x > 2 || y > 2 ||
      this.board[z] != 0
    ) return false
    // 将棋子放入相应棋格
    this.board[z] = 1
    return true
  }

  // 机器人自动走棋，低等级
  autoGo0() {
    // 寻找哪些位置没有棋子
    var tmp = []
    for (var i = 0; i < this.board.length; i++) {
      if (this.board[i] === 0) tmp.push(i)
    }
    // 从没有棋子的位置中随机选择一个着棋
    var p = tmp[parseInt(Math.random() * tmp.length)]
    this.board[p] = -1
  }

  // 机器人自动走棋，高等级
  autoGo1() {
    // 如果某条线上有两个棋子，则进行堵截或赢棋
    for (var line of Lines) {
      var lineSum = Utils.sumIndex(this.board, line)
      if (Math.abs(lineSum) != 2) continue
      for (var p of line) {
        if (this.board[p] === 0) {
          this.board[p] = -1
          return
        }
      }
    }
    // 先中心、再角落、最后四边，检查空位落棋
    for (var p of Points) {
      if (this.board[p] === 0) {
        this.board[p] = -1
        return
      }
    }
  }

  // 检查是否有一方获胜，或和局
  check() {
    for (var line of Lines) {
      var lineSum = Utils.sumIndex(this.board, line)
      if (lineSum === 3) return "恭喜获胜"
      if (lineSum === -3) return "挑战失败"
    }
    if (this.board.every((x) => x != 0))
      return "和局"
    return ""
  }

  // 绘制背景与棋盘
  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 背景颜色
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, W, H)
    // 棋盘背景色
    ctx.fillStyle = 'burlywood'
    ctx.fillRect(0, this.h0 - 5, W, W)
    // 棋盘外边框
    ctx.strokeRect(0, this.h0 - 5, W, W)
    // 棋盘内边框
    ctx.strokeRect(this.w0, this.h0, this.w, this.w)
    // 棋盘网格线
    ctx.beginPath();
    for (var i = 1; i < 3; i++) {
      // 竖直线
      ctx.moveTo(this.w0 + this.cellW * i, this.h0)
      ctx.lineTo(this.w0 + this.cellW * i, this.h1)
      // 水平线
      ctx.moveTo(this.w0, this.h0 + this.cellW * i)
      ctx.lineTo(this.w1, this.h0 + this.cellW * i)
    }
    ctx.stroke();

    // 棋子
    for (var i = 0; i < 9; i++) {
      if (this.board[i] === 0) continue
      var x = parseInt(i / 3), y = i % 3
      var chessType = [1, 0, 0, 1][this.board[i] + this.offensive + 1]
      ctx.drawImage(Images[chessType],
        this.w0 + this.cellW * x + this.gap, 
        this.h0 + this.cellW * y + this.gap, 
        this.cellW - this.gap * 2, 
        this.cellW - this.gap * 2
      )
    }

    // 玩家阵营
    ctx.drawImage(Images[this.offensive],
      W / 2 - this.h0 * 0.2, this.h0 * 1.3 + this.w, this.h0 * 0.4, this.h0 * 0.4
    )

    // 比赛结果
    if (this.result != "") {
      ctx.drawImage(Images["bar"],
        0, this.h0 * 0.5 - W / 12, W, W / 6
      )
      ctx.font = 'bold ' + W / 12 + 'px monospace'
      ctx.fillStyle = this.offensive ? "red" : "black"
      ctx.fillText(this.result, W / 2, this.h0 * 0.5)
    }

    // 实现帧动画
    this.aniId = window.requestAnimationFrame(this.draw.bind(this), canvas)
  }

  // 绘制开始游戏界面
  drawInit() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 背景色
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, W, H)
    // 游戏标题
    ctx.fillStyle = 'black'
    ctx.font = 'bold ' + W / 6 + 'px monospace'
    ctx.fillText("井字棋", W / 2, H / 4)
    // 难易度按钮
    ctx.drawImage(Images["difficulty" + this.difficulty],
      W / 4 - W / 6, H / 2 - W / 6, W / 3, W / 3
    )
    // 先后手按钮
    ctx.drawImage(Images["offensive" + this.offensive],
      W / 4 * 3 - W / 6, H / 2 - W / 6, W / 3, W / 3
    )
    // 开始游戏按钮
    ctx.drawImage(Images["bar"],
      W / 12, H / 4 * 3 - W / 12, W / 6 * 5, W / 6
    )
    ctx.font = 'bold ' + W / 12 + 'px monospace'
    ctx.fillText("开始游戏", W / 2, H / 4 * 3)

    // 实现帧动画
    this.aniId = window.requestAnimationFrame(this.drawInit.bind(this), canvas)
  }

  // 修改游戏设定
  changeSettings(X, Y) {
    // 修改难易度
    if (Math.pow(X - W / 4, 2) + Math.pow(Y - H / 2, 2) < Math.pow(W / 6, 2)) {
      this.difficulty = (this.difficulty + 1) % 2
      return true
    }
    // 修改先后手
    if (Math.pow(X - W / 4 * 3, 2) + Math.pow(Y - H / 2, 2) < Math.pow(W / 6, 2)) {
      this.offensive = (this.offensive + 1) % 2
      return true
    }
    // 开始游戏
    if (X > W / 12 && X < W / 12 * 11 &&
      Y > H / 4 * 3 - W / 12 && Y < H / 4 * 3 + W / 12
    ) {
      window.cancelAnimationFrame(this.aniId)
      return null
    }
    return false
  }

}