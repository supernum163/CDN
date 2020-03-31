
let newImage = function (src) {
  let image = new Image()
  image.src = src
  return image
}

const Images = {
  'cue': newImage('images/cue.png'),
  'arrow': newImage('images/arrow.png'),
  'ball1': newImage('images/ball1.png'),
  'hole': newImage('images/hole.png'),
}

export default Images