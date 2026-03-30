import './styles/reset.css'
import './styles/crt.css'
import './styles/terminal.css'
import { initBinaryRain } from './modules/binary-rain.js'
import { startBoot } from './modules/boot-sequence.js'

// Init background rain
const canvas = document.getElementById('rain')
initBinaryRain(canvas)

// Start boot sequence after CRT animation begins
window.addEventListener('load', () => {
  startBoot()
})
