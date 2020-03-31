import './js/libs/weapp-adapter'
import './js/libs/symbol'

// 点击分享
let onShareAppMessage = function (res) {
  return {
    title: "斗兽棋",
    desc: '翻面与移动，“吃掉” 所有对方棋子，即可击败对手',
    path: "pages/animalsChess",
    imageUrl: 'image/share.png',
    success: function (shareTickets) {
      console.info('转发成功：' + shareTickets);
    },
    fail: function (res) {
      console.log('转发失败：' + res);
    },
    complete: function (res) {
    }
  }
}
wx.showShareMenu({ withShareTicket: true })

// 主程序入口
import Play from './js/play.js'
new Play()