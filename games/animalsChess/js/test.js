
this.chesses = [
  10, 11, 12, 13, 14, 15, 16,
  20, 21, 22, 23, 24, 25, 26, 27,
]
this.positions = [
  [0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2], [1, 3],
  [2, 0], [2, 1], [2, 2], [2, 3], [3, 0], [3, 1], [3, 2], [3, 3]
]

function getChess(i, j) {
  if (i < 0 || i > 3 || j < 0 || j > 3)
    return null
  return this.board[i][j]
}

// 根据位置修改棋子
function setChess(i, j, chess) {
  if (i < 0 || i > 3 || j < 0 || j > 3)
    return false
  this.board[i][j] = chess
  return true
}

// 判断将第一个棋子移动到第二个位置后的 “得分”
function scoreOfMove(i1, j1, chess1, i2, j2) {
  // 判断两个位置是否 “不近邻”
  if (Math.abs(i1 - i2) + Math.abs(j1 - j2) != 1) return -9
  // 获取第二个位置上的棋子
  var chess2 = this.getChess(i2, j2)
  // 判断第二个棋子是否未翻开，或两个棋子属于同一个阵营
  if (chess2 === null || chess2 === 9 ||
    parseInt(chess1 / 10) === parseInt(chess2 / 10)
  ) return -9
  // 判断第二个位置上是否没有棋子
  if (chess2 === 0) return 0.1
  // 判断移动后的 “得分”
  var chess1 = chess1 % 10; var chess2 = chess2 % 10
  if (chess1 === 7 && chess2 === 0) return -7
  if (chess1 === 0 && chess2 === 7) return 7
  if (chess1 === chess2) return 0
  return chess1 > chess2 ? chess2 + 1 : -chess1 - 1
}

// 将棋子翻面，或者从一个位置移动到另一个位置
function moveChess(i1, j1, chess1, i2, j2, playerGo) {
  // 将棋子翻面
  if (chess1 === 9) {
    if (i1 != i2 || j1 != j2) return false
    var i = parseInt(Math.random() * this.chesses.length)
    var chess = this.chesses.splice(i, 1)[0]
    this.setChess(i1, j1, chess)
    // 判断玩家阵营是否确立
    if (this.camp === null)
      this.camp = (parseInt(chess / 10) + playerGo) % 2 + 1
    return true
  }
  // 将棋子从一个位置移动到另一个位置
  var score = this.scoreOfMove(i1, j1, chess1, i2, j2)
  // 判断第一个棋子是否能和第二个棋子 “同归于尽”
  if (score === 0) {
    this.setChess(i1, j1, 0)
    this.setChess(i2, j2, 0)
    return true
  }
  // 判断第一个棋子是否能走到第二个位置
  if (score > 0) {
    this.setChess(i1, j1, 0)
    this.setChess(i2, j2, chess1)
    return true
  }
  // 其它情况，如第一个棋子无法走到第二个位置
  return false
}


this.board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 17],
  [0, 0, 16, 25],
]

this.board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 17],
  [0, 0, 20, 25],
]

this.board = [
  [0, 0, 0, 0],
  [0, 0, 26, 0],
  [17, 0, 13, 0],
  [0, 0, 0, 0],
]

this.board = [
  [0, 0, 0, 0],
  [0, 0, 0, 26],
  [17, 0, 13, 0],
  [0, 0, 0, 0],
]

this.board = [
  [0, 0, 0, 0],
  [0, 0, 13, 0],
  [0, 17, 0, 0],
  [26, 0, 0, 0],
]

this.board = [
  [0, 0, 0, 0],
  [0, 0, 13, 0],
  [0, 0, 20, 0],
  [0, 0, 10, 17],
]

this.board = [
  [9, 9, 9, 9],
  [9, 9, 9, 9],
  [9, 9, 17, 9],
  [9, 9, 9, 9],
]

this.board = [
  [0, 20, 0, 0],
  [0, 26, 0, 16],
  [13, 0, 0, 0],
  [17, 12, 0, 0],
]

this.board = [
  [9, 9, 9, 9],
  [15, 0, 0, 0],
  [9, 0, 17, 27],
  [9, 9, 9, 16],
]
this.board = [
  [14, 0, 0, 0],
  [10, 0, 24, 17],
  [0, 0, 0, 12],
  [0, 0, 0, 0],
]
this.camp = 2
smartMove(board, camp)
positions = [[0, 0], [0, 2], [0, 3], [1, 0], [2, 2], [3, 0], [3, 1]]

this.autoGo1()
this.board