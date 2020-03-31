
import Click from "bubbles/click.js"
import Press from "bubbles/press.js"
import Love from "bubbles/love.js"
import Gold from "bubbles/gold.js"

import Images from "base/images.js"
import Audios from "base/audios.js"
import Adapt from "base/adapt.js"
import Util from "base/util.js"

let ctx = canvas.getContext('2d')
ctx.textBaseline = 'middle'

// 游戏主函数
export default class Play {
  constructor() {
    // 游戏阶段，0 表示起始界面；1 表示游戏过程；2 表示游戏结束；3 表示比赛结果界面
    this.stage = 0
    this.audio = new Audios()
    this.loop = this.mainLoop.bind(this)
    this.loop()
    // 绑定触摸事件处理函数
    this.Tstart = this.touchStartHandler.bind(this)
    this.Tmove = this.touchMoveHandler.bind(this)
    this.Tend = this.touchEndHandler.bind(this)
    canvas.addEventListener('touchstart', this.Tstart, false)
    canvas.addEventListener('touchmove', this.Tmove, false)
    canvas.addEventListener('touchend', this.Tend, false)
  }

  // 重新开始游戏时需要重置的信息
  init() {
    this.B = []
    this.time = Util.time()
    this.timeLeft = 300
    this.money = 1000
    this.result = 0
    this.frame = 0
  }

  // 游戏界面添加气泡
  add(X, Y) {
    // 当用户点击屏幕时出现气泡
    if (!X || !Y) {
      var X = Math.random() * Adapt.W, Y = 0
    }
    let imageId, r = Math.random()
    if (r > 0.9 && Util.time() - this.time > 60) {
      imageId = Util.choose([20, 20, 20, 21, 21, 22, 30, 30, 40, 40])
    } else {
      imageId = Util.choose([10, 11, 12])
    }
    // 先考虑回收利用
    for (var b of this.B) {
      if (b.show || b.imageId != imageId) continue
      b.init(X, Y)
      return
    }
    // 再考虑新建对象
    let bubble
    if (imageId < 20) bubble = new Click(X, Y, imageId)
    else if (imageId < 30) bubble = new Press(X, Y, imageId)
    else if (imageId < 40) bubble = new Love(X, Y, imageId)
    else bubble = new Gold(X, Y, imageId)
    this.B.push(bubble)
  }

  // 游戏界面，更新气泡位置及大小
  update() {
    // 碰撞检测
    for (var i = 0; i < this.B.length; i++) {
      var b1 = this.B[i]
      if (!b1.show || b1.TStime != null) continue
      let xdict = [], ydict = [], xInEdge = false, yInEdge = false
      // 检测是否碰到边缘
      if (b1.x - b1.radius < 0) {
        b1.xdict = 0.5; xInEdge = true
      } else if (b1.x + b1.radius > Adapt.W) {
        b1.xdict = -0.5; xInEdge = true
      }
      if (b1.y - b1.radius < 0) {
        b1.ydict = 0.5; yInEdge = true
      } else if (b1.y + b1.radius > Adapt.h) {
        b1.ydict = -0.5; yInEdge = true
      }
      if (xInEdge && yInEdge) break
      // 检测是否碰到其它气泡
      for (var j = 0; j < this.B.length; j++) {
        var b2 = this.B[j]
        if (i === j || !b2.show) continue
        var xdist = b1.x - b2.x
        var ydist = b1.y - b2.y
        if (xdist ** 2 + ydist ** 2 <
          (b1.radius + b2.radius) ** 2
        ) {
          xdict.push(xdist)
          ydict.push(ydist)
        }
      }
      if (xdict.length === 0 || ydict.length === 0) continue
      var xdist = xdict.reduce((a, b) => a + b)
      var ydist = ydict.reduce((a, b) => a + b)
      var dist = Math.abs(xdist) + Math.abs(ydist)
      if (!xInEdge) b1.xdict = xdist / dist
      if (!yInEdge) b1.ydict = ydist / dist
    }
    // 更新气泡位置
    this.B.forEach(b => {
      if (!b.show) return
      if (b.TStime != null) {
        if (b.x - b.radius < 0) b.x = b.radius
        else if (b.x + b.radius > Adapt.W) b.x = Adapt.W - b.radius
        if (b.y - this.radius < 0) b.y = b.radius
        else if (b.y + b.radius > Adapt.h) b.y = Adapt.h - b.radius
      } else {
        b.x += b.xdict
        b.y += b.ydict
      }
      b.radius += 0.05
    })
    // 更新系统时间
    this.timeLeft = 300 + this.time - Util.time()
  }

  // 检查挑战结果
  check() {
    // 检测是否挑战成功
    if (this.money >= 1e6) return 1
    // 检测是否破产或时间到
    if (this.money <= 0 || this.timeLeft <= 0) return 2
    // 检测气泡是否已经严重重叠（不能弹开）
    for (var i = 0; i < this.B.length; i++) {
      var b1 = this.B[i]
      if (!b1.show) continue
      for (var j = i + 1; j < this.B.length; j++) {
        var b2 = this.B[j]
        if (!b2.show) continue
        if ((b1.x - b2.x) ** 2 + (b1.y - b2.y) ** 2 <
          (b1.radius + b2.radius) ** 2 - 900
        ) return 2
      }
    }
    // 继续挑战
    return 0
  }

  drawBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, Adapt.W, Adapt.H)
  }

  // 绘制游戏过程
  draw() {
    this.drawBg()
    // 绘制气泡
    for (var b of this.B) {
      if (!b.show) continue
      ctx.drawImage(Images[b.imageId],
        b.x - b.radius, b.y - b.radius,
        b.radius * 2, b.radius * 2
      )
    }
    // 绘制底部信息栏
    ctx.fillStyle = 'black'
    ctx.fillRect(0, Adapt.h, Adapt.W, Adapt.H)
    ctx.font = 'normal 15px monospace'
    var msg = parseInt(this.timeLeft / 60) + ": " + 
      Util.int2str(this.timeLeft % 60, 2)
    ctx.textAlign = 'left'
    ctx.fillStyle = "cyan"
    ctx.fillText(msg, 10, Adapt.h + 10)
    var s1 = parseInt(this.money / 1e4)
    var s2 = parseInt(this.money % 1e4).toString()
    var msg = (s1 != 0 ? s1 + "万 " + Array(5 - s2.length).join("0"): "") + s2
    ctx.textAlign = 'right'
    ctx.fillStyle = "gold"
    ctx.fillText(msg, Adapt.w, Adapt.h + 10)
  }

  // 绘制开始界面
  drawStarting() {
    this.drawBg()
    // 游戏标题
    ctx.font = 'bold ' + parseInt(Adapt.W_8) + 'px monospace'
    ctx.textAlign = 'center'
    ctx.fillStyle = "red"
    ctx.fillText("气泡模拟器", Adapt.W_2, Adapt.H_6)
    // 小贴士
    ctx.drawImage(Images["tip"],
      Adapt.W_12, Adapt.H_2 - Adapt.W_12_5 / 2, 
      Adapt.W_12_5 * 2, Adapt.W_12_5
    )
    // 开始按钮
    ctx.font = 'normal 35px monospace'
    ctx.fillStyle = "red"
    ctx.fillText("开始游戏", Adapt.W_2, Adapt.H_4_3)
    ctx.strokeRect(Adapt.W_12, Adapt.H_4_3 - 30, Adapt.W_12_5 * 2, 60)
  }

  // 修改游戏设定
  changeSettings(X, Y) {
    // 点击开始游戏
    if (X > Adapt.W_12 && X < Adapt.W - Adapt.W_12 &&
      Y > Adapt.H_4_3 - 30 && Y < Adapt.H_4_3 + 30
    ) return null
    return false
  }

  // 绘制比赛结果
  drawEndding() {
    this.drawBg()
    // 上下边框
    ctx.beginPath();
    ctx.moveTo(0, Adapt.H_2 - 30)
    ctx.lineTo(Adapt.W, Adapt.H_2 - 30)
    ctx.moveTo(0, Adapt.H_2 + 30)
    ctx.lineTo(Adapt.W, Adapt.H_2 + 30)
    ctx.stroke();
    // 是否挑战成功
    ctx.font = 'normal 40px monospace'
    ctx.textAlign = 'center'
    ctx.fillStyle = "red"
    var msg = ["挑战继续", "恭喜获胜", "挑战失败"][this.result]
    ctx.fillText(msg, Adapt.W_2, Adapt.H_2)
  }

  // 游戏画面主循环
  mainLoop() {
    if (this.stage === 0) this.drawStarting()
    else if (this.stage === 3) this.drawEndding()
    else if (this.stage === 1) {
      this.result = this.check()
      if (this.result != 0) this.stage = 2
      if (this.frame % 90 === 0) this.add()
      this.B.forEach(b => b.grow(this))
      this.update()
      this.draw()
      this.frame ++
    } 
    // 实现帧动画
    this.aniId = window.requestAnimationFrame(this.loop, canvas)
  }

  // 触摸事件管理
  touchStartHandler(e) {
    e.preventDefault()
    let X = e.touches[e.touches.length - 1].clientX
    let Y = e.touches[e.touches.length - 1].clientY
    if (this.stage === 1) {
      for (var b of this.B) {
        if (!b.show ||
          (b.x - X) ** 2 + (b.y - Y) ** 2 > b.radius ** 2
        ) continue
        b.TStime = e.timeStamp
        b.xdict = 0
        b.ydict = 0
        return
      }
      this.add(X, Y)
    } else if (this.stage === 0) {
      if (this.changeSettings(X, Y) != null) return
      this.stage = 1
      this.init()
    } else if (this.stage === 2) {
      this.stage = 3
    } else if (this.stage === 3) {
      this.stage = 0
    }
  }

  touchMoveHandler(e) {
    e.preventDefault()
    if (this.stage != 1) return
    let X = e.touches[0].clientX
    let Y = e.touches[0].clientY
    for (var b of this.B) {
      if (!b.show || b.TStime === null ||
        (b.x - X) ** 2 + (b.y - Y) ** 2 > b.radius ** 2
      ) continue
      if (X - b.radius < 0) X = b.radius
      else if (X + b.radius > Adapt.W) X = Adapt.W - b.radius
      if (Y - b.radius < 0) Y = b.radius
      else if (Y + b.radius > Adapt.h) Y = Adapt.h - b.radius
      b.x = X
      b.y = Y
      break
    }
  }

  touchEndHandler(e) {
    e.preventDefault()
    if (this.stage != 1) return
    let X = e.changedTouches[0].clientX
    let Y = e.changedTouches[0].clientY
    for (var b of this.B) {
      if (!b.show || b.TStime === null ||
        (b.x - X) ** 2 + (b.y - Y) ** 2 > b.radius ** 2
      ) continue
      this.audio.playBoom(b.imageId % 10)
      b.show = false
      break
    }
  }

}