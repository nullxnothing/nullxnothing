const BINARY = '01'

export function scrambleReveal(element, finalText, options = {}) {
  const {
    duration = 1200,
    charSet = BINARY,
    stagger = 'left-to-right',
  } = options

  return new Promise((resolve) => {
    const chars = finalText.split('')
    const length = chars.length
    const startTime = performance.now()

    // Each character gets a random resolve time
    const resolveTimes = chars.map((_, i) => {
      const base = stagger === 'left-to-right'
        ? (i / length) * duration * 0.7
        : Math.random() * duration * 0.7
      return base + Math.random() * duration * 0.3
    })

    const resolved = new Array(length).fill(false)

    function randomChar() {
      return charSet[Math.floor(Math.random() * charSet.length)]
    }

    function update() {
      const elapsed = performance.now() - startTime
      let display = ''
      let allDone = true

      for (let i = 0; i < length; i++) {
        if (chars[i] === ' ') {
          display += ' '
          continue
        }

        if (resolved[i]) {
          display += chars[i]
        } else if (elapsed >= resolveTimes[i]) {
          resolved[i] = true
          display += chars[i]
        } else {
          allDone = false
          display += randomChar()
        }
      }

      element.textContent = display

      if (allDone) {
        resolve()
      } else {
        requestAnimationFrame(update)
      }
    }

    requestAnimationFrame(update)
  })
}
