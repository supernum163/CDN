
import './js/libs/weapp-adapter'
import './js/libs/symbol'

// 点击分享
let onShareAppMessage = function (res) {
  return {
    title: "气泡模拟器",
    desc: '这款游戏教你5分钟赚够100万，快来试试吧',
    path: "pages/bubbles",
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
import Play from 'js/play.js'
new Play()
