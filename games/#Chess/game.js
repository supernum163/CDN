import './js/libs/weapp-adapter'
import './js/libs/symbol'

// 点击分享
let onShareAppMessage = function (res) {
  return {
    title: "井字棋",
    desc : "在 3 * 3 棋盘中将棋子连成一线，击败对手",
    path: "pages/#Chess",
    imageUrl: "image/share.png",
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
import Play from './js/play'
new Play()


