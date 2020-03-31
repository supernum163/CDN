
let Adapt = {
  W: Math.min(window.innerWidth, window.innerHeight),
  H: Math.max(window.innerWidth, window.innerHeight)
}

Adapt.i = Math.min(Adapt.W / 90, Adapt.H / 160)
Adapt.w = Adapt.i * 90
Adapt.h = Adapt.i * 160
Adapt.w0 = Adapt.W / 2
Adapt.h0 = Adapt.H / 2
Adapt.w1 = Adapt.w0 - Adapt.i * 45
Adapt.h1 = Adapt.h0 - Adapt.i * 80
Adapt.w2 = Adapt.w0 + Adapt.i * 45
Adapt.h2 = Adapt.h0 + Adapt.i * 80
Adapt.fontSize = 20
Adapt.fontPerLine = parseInt(Adapt.w / Adapt.fontSize) - 1

export default Adapt
