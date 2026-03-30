import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrambleReveal } from './scramble.js'
import { renderProjects } from './projects.js'

gsap.registerPlugin(TextPlugin, ScrollTrigger)

const BOOT_LINES = [
  'LOADING ............. OK',
  'CONNECTING .......... OK',
  '',
  'SYSTEM READY.',
]

const LINKS = [
  { label: 'x.com/nullxnothing', url: 'https://x.com/nullxnothing' },
  { label: 'github.com/nullxnothing', url: 'https://github.com/nullxnothing' },
]

export function startBoot() {
  const isMobile = window.innerWidth < 600
  const speedMult = isMobile ? 0.6 : 1

  const bootContainer = document.getElementById('boot')
  const tl = gsap.timeline()

  // Create boot line elements
  BOOT_LINES.forEach(() => {
    const line = document.createElement('div')
    line.className = 'boot-line'
    bootContainer.appendChild(line)
  })

  const bootEls = bootContainer.querySelectorAll('.boot-line')

  // Wait for CRT animation
  tl.to({}, { duration: 0.6 * speedMult })

  // Type each boot line
  BOOT_LINES.forEach((text, i) => {
    if (text === '') {
      tl.to({}, { duration: 0.15 * speedMult })
      return
    }

    tl.to(bootEls[i], {
      duration: Math.max(0.2, text.length * 0.015) * speedMult,
      text: { value: text },
      ease: 'none',
    }, `+=0.08`)
  })

  // Fade out boot lines after they play
  tl.to(bootContainer, {
    opacity: 0,
    duration: 0.5,
    delay: 0.3 * speedMult,
    onComplete: () => { bootContainer.style.display = 'none' },
  })

  // After boot: reveal identity
  tl.call(() => revealIdentity(speedMult))
}

async function revealIdentity(speedMult) {
  const identity = document.getElementById('identity')
  const nameText = document.getElementById('name-text')
  const descriptor = document.getElementById('descriptor')

  identity.style.visibility = 'visible'
  gsap.to(identity, { opacity: 1, duration: 0.3 })

  // Scramble the name from binary
  await scrambleReveal(nameText, 'nullxnothing', {
    duration: 1500 * speedMult,
    stagger: 'left-to-right',
  })

  // Type descriptor
  await new Promise((resolve) => {
    gsap.to(descriptor, {
      duration: 1.8 * speedMult,
      text: { value: 'solana developer — building onchain tools & infrastructure' },
      ease: 'none',
      onComplete: resolve,
    })
  })

  // Reveal links under identity
  await revealLinks(speedMult)

  // Reveal projects
  revealProjects(speedMult)
}

async function revealLinks(speedMult) {
  const linksList = document.getElementById('links-list')

  LINKS.forEach((link) => {
    const a = document.createElement('a')
    a.href = link.url
    a.target = '_blank'
    a.rel = 'noopener'
    a.className = 'link-item'
    linksList.appendChild(a)
  })

  const linkEls = linksList.querySelectorAll('.link-item')

  linksList.style.visibility = 'visible'
  gsap.to(linksList, { opacity: 1, duration: 0.3 })

  for (let i = 0; i < LINKS.length; i++) {
    await scrambleReveal(linkEls[i], LINKS[i].label, { duration: 400 * speedMult })
  }
}

function revealProjects(speedMult) {
  const projectsSection = document.getElementById('projects-section')
  const projectsLabel = document.getElementById('projects-label')

  projectsSection.style.visibility = 'visible'
  gsap.to(projectsSection, { opacity: 1, duration: 0.4 })

  scrambleReveal(projectsLabel, 'Projects', { duration: 400 }).then(() => {
    renderProjects()
    revealEnd()
  })
}

function revealEnd() {
  const termEnd = document.getElementById('terminal-end')
  termEnd.style.visibility = 'visible'
  gsap.to(termEnd, { opacity: 1, duration: 0.5 })
}
