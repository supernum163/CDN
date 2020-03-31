
let newImage = function (src) {
  var image = new Image()
  image.src = src
  return image
}

const Images = {
  "1": newImage('image/1.png'),
  "5": newImage('image/5.png'),
  "6": newImage('image/6.png'),
  "11": newImage('image/11.png'),
  "12": newImage('image/12.png'),
  "13": newImage('image/13.png'),
  "14": newImage('image/14.png'),
  "15": newImage('image/15.png'),
  "16": newImage('image/16.png'),
  "17": newImage('image/17.png'),
  "18": newImage('image/18.png'),
  "19": newImage('image/19.png'),
}

export default Images