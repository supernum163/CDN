
import Images from 'base/images.js'
import Audios from 'base/audios.js'
import Adapt from 'base/adapt.js'
import Util from 'base/util.js'
import Cue from 'balls/cue.js'
import Level0 from 'levels/level0.js'
const ctx = canvas.getContext('2d')

export default class Play {
  constructor() {
    this.level = new Level0()
    this.stage = 1
    this.loop = this.mainLoop.bind(this)
    this.loop()
    this.touch = this.touchHandler.bind(this)
    canvas.addEventListener('touchstart', this.touch)
    canvas.addEventListener('touchmove', this.touch)
    canvas.addEventListener('touchend', this.touch)
  }

  // 绘制游戏开始界面
  drawStarting() {
    // 清除画面
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 背景颜色
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, Adapt.W, Adapt.H)
    // 游戏标题
    ctx.font = 'bold 50px monospace'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillStyle = "red"
    ctx.fillText("弹珠模拟器", Adapt.w0, Adapt.h0 - Adapt.i * 50)
    // 先后手按钮
    ctx.font = 'normal 40px monospace'
    ctx.strokeRect(10, Adapt.h0 - 60, Adapt.W - 20, 60)
    ctx.fillText(this.limit === "time" ? "??模式" : "??模式", Adapt.w0, Adapt.h0 - 30)
    // 难易度按钮
    ctx.strokeRect(10, Adapt.h0 + 20, Adapt.W - 20, 60)
    ctx.fillText(this.difficulty === 0 ? "??模式" : "??模式", Adapt.w0, Adapt.h0 + 50)
    // 开始按钮
    ctx.strokeRect(10, Adapt.h0 + 120, Adapt.W - 20, 60)
    ctx.fillText("开始游戏", Adapt.w0, Adapt.h0 + 150)

  }

  // 修改游戏设定
  changeSettings(X, Y) {
    if (X > 10 && X < Adapt.W - 10 && Y > Adapt.h0 - 60 && Y < Adapt.h0) {
      this.limit = this.limit === "time" ? "life" : "time"
      return true
    }
    if (X > 10 && X < Adapt.W - 10 && Y > Adapt.h0 + 20 && Y < Adapt.h0 + 80) {
      this.difficulty = (this.difficulty + 1) % 2
      return true
    }
    if (X > 10 && X < Adapt.W - 10 && Y > Adapt.h0 + 120 && Y < Adapt.h0 + 180)
      return null
    return false
  }

  // 绘制游戏结束界面
  drawEndding() {
    // 清除画面
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 背景颜色
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, Adapt.W, Adapt.H)
    // 上下边框
    ctx.beginPath();
    ctx.moveTo(0, Adapt.h0 - 30)
    ctx.lineTo(Adapt.W, Adapt.h0 - 30)
    ctx.moveTo(0, Adapt.h0 + 30)
    ctx.lineTo(Adapt.W, Adapt.h0 + 30)
    ctx.stroke();
    // 挑战结果
    ctx.font = 'normal 40px monospace'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillStyle = "red"
    var msg = ["挑战继续", "恭喜获胜", "挑战失败"][this.result]
    ctx.fillText(msg, Adapt.w0, Adapt.h0)
  }

  // 处理触摸事件
  touchHandler(e) {
    e.preventDefault()
    if (this.stage === 1) {
      this.level.cue.handleTouch(e)
    } else if (e.type != 'touchstart') {
      return 
    } else if (this.stage === 0) {
      var X = e.touches[0].clientX
      var Y = e.touches[0].clientY
      if (this.changeSettings(X, Y) === null)
        this.stage = 1
    } else if (this.stage === 2) {
      this.stage = 3
    } else if (this.stage === 3) {
      this.stage = 0
    }
  }

  // 游戏画面主循环
  mainLoop() {
    if (this.stage === 0) {
      this.drawStarting()
    } else if (this.stage === 1) {
      this.level.draw(ctx)
      this.result = this.level.update()
      if (this.result > 0) this.stage = 2
    } else if (this.stage === 2) {
      this.level.draw(ctx)
    } else if (this.stage === 3) {
      this.drawEndding()
    }
    window.requestAnimationFrame(this.loop, canvas)
  }

}
