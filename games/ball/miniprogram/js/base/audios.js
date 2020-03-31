
let newAudio = function (src, loop = false) {
  let audio = new Audio()
  audio.loop = loop
  audio.src = src
  return audio
}


const Audios = {
  "bgm": newAudio("audios/bgm.mp3", true),
  "boom": newAudio("audios/boom.mp3"),
}

export default Audios