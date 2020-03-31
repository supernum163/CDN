
let newImage = function(src) {
  var image = new Image()
  image.src = src
  return image
}

const Images = {
  "0": newImage('image/0.png'),
  "1": newImage('image/1.png'),
  "difficulty0": newImage('image/difficulty0.png'),
  "difficulty1": newImage('image/difficulty1.png'),
  "offensive0": newImage('image/offensive0.png'),
  "offensive1": newImage('image/offensive1.png'),
  "bar": newImage('image/bar.png'),
  "share": newImage('image/share.png'),
}

export default Images
