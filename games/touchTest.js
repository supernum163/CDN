/* 在 game.js 中插入以下代码
  import TouchTest from 'touchTest.js'
  new TouchTest()
*/

const W = window.innerWidth
const H = window.innerHeight
const ctx = canvas.getContext('2d')

export default class TouchTest {
  constructor() {
    this.touch = this.touchHandler.bind(this)
    canvas.addEventListener('touchstart', this.touch, false)
    canvas.addEventListener('touchmove', this.touch, false)
    canvas.addEventListener('touchend', this.touch, false)
    setTimeout(this.drawBg, 1000)
  }

  drawBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, W, H)
  }

  touchHandler(e) {
    e.preventDefault()
    this.drawBg()
    ctx.font = 'normal 15px monospace'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    ctx.fillStyle = "red"
    for (var i = 0; i < e.changedTouches.length; i++) {
      ctx.fillText(e.type + ": " +
        parseInt(e.changedTouches[i].clientX) + ": " +
        parseInt(e.changedTouches[i].clientY),
        20, 50 + 20 * i
      )
    }
  }
  
}