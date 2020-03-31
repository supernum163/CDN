import './js/libs/weapp-adapter'
import './js/libs/symbol'

// 点击分享
let onShareAppMessage = function (res) {
  return {
    title: "烟花模拟器",
    desc: "在夜空中发射绚丽的烟花",
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


