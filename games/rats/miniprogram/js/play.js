
import { random, choose, where, time, int2str } from "base/utils.js"
import Images from "base/images.js"
import Music from "runtime/music.js"

import Rat11 from "rats/rat11.js"
import Rat12 from "rats/rat12.js"
import Rat13 from "rats/rat13.js"
import Rat14 from "rats/rat14.js"
import Rat15 from "rats/rat15.js"
import Rat16 from "rats/rat16.js"
import Rat17 from "rats/rat17.js"
import Rat18 from "rats/rat18.js"
import Rat19 from "rats/rat19.js"

const W = window.innerWidth
const H = window.innerHeight - 20
const ctx = canvas.getContext('2d')

// 游戏主函数
export default class Play {
  constructor() {
    this.w = Math.min(W / 3, H / 4 - 20)
    this.pos = [
      [W / 4 - this.w / 2, H / 2 - this.w * 2],
      [W / 4 * 3 - this.w / 2, H / 2 - this.w * 2],
      [W / 6 - this.w / 2, H / 2 - this.w],
      [W / 2 - this.w / 2, H / 2 - this.w],
      [W / 6 * 5 - this.w / 2, H / 2 - this.w],
      [W / 4 - this.w / 2, H / 2],
      [W / 4 * 3 - this.w / 2, H / 2],
      [W / 6 - this.w / 2, H / 2 + this.w],
      [W / 2 - this.w / 2, H / 2 + this.w],
      [W / 6 * 5 - this.w / 2, H / 2 + this.w],
    ]
    this.R = [new Rat19(0, 0)]
    this.limit = "time"
    this.difficulty = 0
    // 游戏阶段，0 表示起始界面；1 表示游戏过程；2 表示游戏结束；3 表示比赛结果界面
    this.stage = 0
    this.init()
    this.music = new Music()
    this.loop = this.mainLoop.bind(this)
    this.loop()
    // 绑定触摸事件处理函数
    this.touch = this.touchStartHandler.bind(this)
    canvas.addEventListener('touchstart', this.touch, false)
  }

  // 重新开始游戏时需要重置的信息
  init() {
    this.holes = [0, 0, 1, 1, 1, 1, 1, 0, 0, 0]
    this.rats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.time = this.limit === "time" ? time() : 0
    this.life = [20, 50][this.difficulty]
    this.prob = [0.2, 0.8][this.difficulty]
    this.skull = [120, 600][this.difficulty]
    this.result = 0
    this.frameId = 0
  }

  avilPos() {
    var a = where(this.holes, 1)
    var b = where(this.rats, 0)
    return a.filter(e => b.includes(e))
  }

  // 游戏界面添加气泡
  add(posId) {
    // 当用户点击屏幕时出现气泡
    if (!posId) {
      var positions = this.avilPos()
      if (positions.length === 0) return
      var posId = choose(positions)
    }
    var choices = this.R[0].show ?
      [1, 1, 1, 1, 1, 2, 2, 3, 4, 5, 5, 6, 6, 7, 7, 8] :
      [1, 1, 1, 1, 1, 2, 2, 3, 4, 5, 5, 6, 6, 7, 7, 8, 9]
    var imageId = choose(choices) + 10
    
    this.rats[posId] = imageId
    // 先考虑回收利用
    for (var i = 0; i < this.R.length; i++) {
      if (this.R[i].show || this.R[i].imageId != imageId) continue
      this.R[i].init(this.frameId, posId)
      return
    }
    // 再考虑新建对象
    let rat
    if (imageId === 19) this.R[0].init(this.frameId, posId)
    else if (imageId === 11) rat = new Rat11(this.frameId, posId)
    else if (imageId === 12) rat = new Rat12(this.frameId, posId)
    else if (imageId === 13) rat = new Rat13(this.frameId, posId)
    else if (imageId === 14) rat = new Rat14(this.frameId, posId)
    else if (imageId === 15) rat = new Rat15(this.frameId, posId)
    else if (imageId === 16) rat = new Rat16(this.frameId, posId)
    else if (imageId === 17) rat = new Rat17(this.frameId, posId)
    else if (imageId === 18) rat = new Rat18(this.frameId, posId)
    this.R.push(rat)
  }

  // 检查挑战结果
  check() {
    if (this.skull <= 0) return 1
    if (this.limit === "life" && this.life <= 0) return 2
    if (this.limit === "time" && time() - this.time >= 300) return 2
    return 0
  }

  // 绘制游戏过程
  draw() {
    // 清除画面
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 背景颜色
    ctx.fillStyle = 'lawngreen'
    ctx.fillRect(0, 0, W, H)
    // 绘制地鼠
    for (var i = 0; i < this.holes.length; i++) {
      if (this.holes[i] === 0) continue
      ctx.drawImage(Images[this.holes[i]],
        this.pos[i][0], this.pos[i][1], this.w, this.w
      )
    }
    for (var i = 0; i < this.rats.length; i++) {
      if (this.rats[i] === 0) continue
      ctx.drawImage(Images[this.rats[i]],
        this.pos[i][0], this.pos[i][1], this.w, this.w
      )
    }
    // 绘制底部信息栏
    ctx.font = 'normal 15px monospace'
    ctx.textBaseline = 'middle'
    if (this.limit === "time") {
      ctx.textAlign = 'center'
      ctx.fillStyle = "cyan"
      var t = 300 + this.time - time()
      var msg = parseInt(t / 60) + ": " + int2str(t % 60, 2)
      ctx.fillText(msg, W / 2, H + 10)
    }
    ctx.textAlign = 'left'
    ctx.fillStyle = "white"
    ctx.fillText("💀 " + this.skull, 10, H + 10)
    ctx.textAlign = 'right'
    ctx.fillStyle = "red"
    var msg = this.limit === "life" ? this.life : "∞"
    ctx.fillText(msg + " ❤", W - 10, H + 10)
  }

  // 绘制开始界面
  drawStarting() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    // 背景颜色
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, W, H + 20)
    // 游戏标题
    ctx.font = 'bold 50px monospace'
    ctx.fillStyle = "red"
    ctx.fillText("快来打地鼠", W / 2, H / 2 - 150)
    // 先后手按钮
    ctx.font = 'normal 40px monospace'
    ctx.strokeRect(10, H / 2 - 60, W - 20, 60)
    ctx.fillText(this.limit === "time" ? "限时模式" : "限命模式", W / 2, H / 2 - 30)
    // 难易度按钮
    ctx.strokeRect(10, H / 2 + 20, W - 20, 60)
    ctx.fillText(this.difficulty === 0 ? "休闲模式" : "极限模式", W / 2, H / 2 + 50)
    // 开始按钮
    ctx.strokeRect(10, H / 2 + 120, W - 20, 60)
    ctx.fillText("开始游戏", W / 2, H / 2 + 150)
  }

  // 修改游戏设定
  changeSettings(X, Y) {
    // 修改难易度
    if (X > 10 && X < W - 10 && Y > H / 2 - 60 && Y < H / 2) {
      this.limit = this.limit === "time" ? "life" : "time"
      return true
    }
    // 修改先后手
    if (X > 10 && X < W - 10 && Y > H / 2 + 20 && Y < H / 2 + 80) {
      this.difficulty = (this.difficulty + 1) % 2
      return true
    }
    // 点击开始游戏
    if (X > 10 && X < W - 10 && Y > H / 2 + 120 && Y < H / 2 + 180) 
      return null
    return false
  }

  // 绘制比赛结果
  drawEndding() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    // 背景颜色
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, W, H + 20)
    // 上下边框
    ctx.beginPath();
    ctx.moveTo(0, H / 2 - 20)
    ctx.lineTo(W, H / 2 - 20)
    ctx.moveTo(0, H / 2 + 40)
    ctx.lineTo(W, H / 2 + 40)
    ctx.stroke();
    // 是否挑战成功
    ctx.font = 'normal 40px monospace'
    ctx.fillStyle = "red"
    var msg = ["挑战继续", "恭喜获胜", "挑战失败"][this.result]
    ctx.fillText(msg, W / 2, H / 2 + 10)
  }

  // 游戏画面主循环
  mainLoop() {
    if (this.stage === 0) this.drawStarting()
    else if (this.stage === 3) this.drawEndding()
    else if (this.stage === 1) {
      if (this.frameId % 20 === 0 && Math.random() < this.prob) this.add()
      this.R.forEach(r => r.update(this))
      this.result = this.check()
      if (this.result != 0) {
        this.music.playBoom(14)
        this.rats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.R.forEach(r => r.show = false)
        this.stage = 2
      }
      this.frameId++
      this.draw()
    } 
    // 实现帧动画
    setTimeout(this.loop, 16.7)
    //this.aniId = window.requestAnimationFrame(this.loop, canvas)
  }

  // 触摸事件管理
  touchStartHandler(e) {
    e.preventDefault()
    let X = e.touches[e.touches.length - 1].clientX
    let Y = e.touches[e.touches.length - 1].clientY
    if (this.stage === 1) {
      for (var i = 0; i < this.R.length; i++) {
        if (!this.R[i].show) continue
        var [x, y] = this.pos[this.R[i].posId]
        if (X < x || Y < y || X > x + this.w || Y > y + this.w) {
          if (i > 0) continue
          this.music.playBoom(19)
          break
        }
        this.R[i].onHit(this)
      }
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

}