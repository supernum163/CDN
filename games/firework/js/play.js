
import Images from 'base/images.js'
import Audios from 'base/audios.js'
import Adapt from 'base/adapt.js'
import Util from 'base/util.js'

import Flower0 from 'flowers/flower0.js'
import Flower1 from 'flowers/flower1.js'
import Fire from 'flowers/fire.js'

const ctx = canvas.getContext('2d')

export default class Play {
  constructor() {
    this.stage = 1
    this.init()
    this.loop = this.mainLoop.bind(this)
    this.loop()
    this.touch = this.touchHandler.bind(this)
    canvas.addEventListener('touchstart', this.touch)
    canvas.addEventListener('touchmove', this.touch)
    canvas.addEventListener('touchend', this.touch)
  }

  init() {
    this.frameId = 0
    this.time = Util.time()
    this.timeLeft = 300
    this.money = 1000

    //this.flowers = [new Flower1(200, 200)]
    this.fire = new Fire(150, 300)
  }

  check() {
    if (this.money >= 1e6) return 1
    if (this.money <= 0 || this.timeLeft <= 0) return 2
    return 0
  }

  update() {

    this.fire.update()
    this.frameId ++
    this.timeLeft = 300 + this.time - Util.time()
  }

  drawBg() {
    // 清除画面
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 背景颜色
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, Adapt.W, Adapt.H)
  }

  draw() {
    // 清除画面
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    //this.flowers.forEach(f => f.draw(ctx))

    this.fire.draw(ctx)
/*
    var radius = [40, 60, 76][this.layer - 4]
    var grd = ctx.createRadialGradient(
      150, 100, 1,
      150, 180, 4
    )
    grd.addColorStop(0, 'rgba(128, 128, 128, 0.5)')
    grd.addColorStop(1, 'rgba(255, 255, 255, 0.5)')
    ctx.strokeStyle = grd
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(150, 80)
    ctx.lineTo(150, 184)
    ctx.stroke()
  
    var grd = ctx.createRadialGradient(
      100, 100, 1,
      100, 200, 4
    )
    grd.addColorStop(0, 'rgba(128, 128, 128, 0.5)')
    grd.addColorStop(1, 'rgba(255, 255, 255, 0.5)')
    ctx.fillStyle = 'white'
    ctx.beginPath();
    ctx.moveTo(150, 300);
    ctx.bezierCurveTo(170, 220, 200, 200, 150, 300);
    ctx.fill(); 
*/
  }

  // 绘制游戏开始界面
  drawStarting() {
    this.drawBg()
    // 游戏标题
    ctx.font = 'bold 50px monospace'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillStyle = "red"
    ctx.fillText("弹珠模拟器", Adapt.w0, Adapt.h0 - Adapt.i * 50)
    // 先后手按钮
    ctx.font = 'normal 40px monospace'
    ctx.strokeRect(10, Adapt.h0 - 60, Adapt.W - 20, 60)
    ctx.fillText(this.limit === "time" ? "??模式" : "??模式",
      Adapt.w0, Adapt.h0 - 30
    )
    // 难易度按钮
    ctx.strokeRect(10, Adapt.h0 + 20, Adapt.W - 20, 60)
    ctx.fillText(this.difficulty === 0 ? "??模式" : "??模式",
      Adapt.w0, Adapt.h0 + 50
    )
    // 开始按钮
    ctx.strokeRect(10, Adapt.h0 + 120, Adapt.W - 20, 60)
    ctx.fillText("开始游戏", Adapt.w0, Adapt.h0 + 150)

  }

  // 修改游戏设定
  changeSettings(X, Y) {
    if (X > 10 && X < Adapt.W - 10 &&
      Y > Adapt.h0 - 60 && Y < Adapt.h0
    ) {
      this.limit = this.limit === "time" ? "life" : "time"
      return true
    }
    if (X > 10 && X < Adapt.W - 10 &&
      Y > Adapt.h0 + 20 && Y < Adapt.h0 + 80
    ) {
      this.difficulty = (this.difficulty + 1) % 2
      return true
    }
    if (X > 10 && X < Adapt.W - 10 &&
      Y > Adapt.h0 + 120 && Y < Adapt.h0 + 180
    ) return null
    return false
  }

  // 绘制游戏结束界面
  drawEndding() {
    this.drawBg()
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

      return
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
    } else if (this.stage === 3) {
      this.drawEndding()
    } else if (this.stage === 1) {
      this.result = this.check()
      if (this.result > 0) this.stage = 2
      this.update()
      this.draw()
    } 
    window.requestAnimationFrame(this.loop, canvas)
  }

}
