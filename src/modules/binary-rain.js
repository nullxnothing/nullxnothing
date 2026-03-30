export function initBinaryRain(canvas) {
  const ctx = canvas.getContext('2d')
  let cols, drops
  let frame = 0
  let animId

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const fontSize = 14
    cols = Math.floor(canvas.width / fontSize)
    drops = new Array(cols).fill(0).map(() =>
      Math.random() > 0.82 ? Math.random() * canvas.height / fontSize : -1
    )
  }

  function draw() {
    frame++
    // Only update every 4th frame for performance + slow feel
    if (frame % 4 !== 0) {
      animId = requestAnimationFrame(draw)
      return
    }

    ctx.fillStyle = 'rgba(10, 10, 10, 0.12)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = '14px JetBrains Mono, monospace'

    for (let i = 0; i < cols; i++) {
      if (drops[i] < 0) {
        // Randomly activate columns
        if (Math.random() > 0.997) {
          drops[i] = 0
        }
        continue
      }

      const char = Math.random() > 0.5 ? '1' : '0'
      const x = i * 14
      const y = drops[i] * 14

      // Varying opacity for depth
      const alpha = 0.03 + Math.random() * 0.05
      ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`
      ctx.fillText(char, x, y)

      // Head of the drop is slightly brighter
      if (Math.random() > 0.8) {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.12)'
        ctx.fillText(char, x, y)
      }

      drops[i]++

      // Reset when off screen, with chance to deactivate
      if (y > canvas.height) {
        drops[i] = Math.random() > 0.4 ? -1 : 0
      }
    }

    animId = requestAnimationFrame(draw)
  }

  // Pause when tab not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId)
    } else {
      animId = requestAnimationFrame(draw)
    }
  })

  window.addEventListener('resize', resize)
  resize()
  draw()
}
