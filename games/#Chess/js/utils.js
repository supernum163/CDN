
export const W = window.innerWidth
export const H = window.innerHeight

export const Points = [4, 0, 2, 6, 8, 1, 3, 5, 7]
export const Lines = [
  [0, 4, 8],
  [2, 4, 6],
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
]

export class Utils {
  // 汇总数组
  static sum(arr) {
    return arr.reduce((a, b) => a + b)
  }

  // 汇总特定下标对应的元素
  static sumIndex(arr, index) {
    var sum = 0
    index.forEach(i => sum += arr[i])
    return sum
  }

}