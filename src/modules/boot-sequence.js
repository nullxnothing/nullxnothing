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

  // After boot: reveal identity
  tl.call(() => revealIdentity(speedMult))
  tl.to({}, { duration: 0.3 * speedMult })
}

async function revealIdentity(speedMult) {
  const identity = document.getElementById('identity')
  const nameText = document.getElementById('name-text')
  const descriptor = document.getElementById('descriptor')
  const cursor = identity.querySelector('.cursor')

  // Show identity section
  identity.style.visibility = 'visible'
  gsap.to(identity, { opacity: 1, duration: 0.1 })

  // Scramble the name from binary
  cursor.classList.add('blink')
  await scrambleReveal(nameText, 'nullxnothing', {
    duration: 1500 * speedMult,
    stagger: 'left-to-right',
  })

  // Remove cursor blink from name, type descriptor
  cursor.classList.remove('blink')
  cursor.style.opacity = '0'

  await new Promise((resolve) => {
    gsap.to(descriptor, {
      duration: 2 * speedMult,
      text: { value: 'solana developer — building onchain tools & infrastructure' },
      ease: 'none',
      onStart: () => { descriptor.style.opacity = '1' },
      onComplete: resolve,
    })
  })

  // Reveal projects section
  revealProjects(speedMult)
}

function revealProjects(speedMult) {
  const projectsSection = document.getElementById('projects-section')
  const projectsCmd = document.getElementById('projects-cmd')

  projectsSection.style.visibility = 'visible'
  gsap.to(projectsSection, { opacity: 1, duration: 0.2 })

  gsap.to(projectsCmd, {
    duration: 0.6 * speedMult,
    text: { value: 'projects' },
    ease: 'none',
    onComplete: () => {
      renderProjects()
      revealLinks(speedMult)
    },
  })
}

function revealLinks(speedMult) {
  const linksSection = document.getElementById('links-section')
  const linksCmd = document.getElementById('links-cmd')
  const linksList = document.getElementById('links-list')

  // Build links HTML
  LINKS.forEach((link) => {
    const a = document.createElement('a')
    a.href = link.url
    a.target = '_blank'
    a.rel = 'noopener'
    a.className = 'link-item'
    linksList.appendChild(a)
  })

  const linkEls = linksList.querySelectorAll('.link-item')

  ScrollTrigger.create({
    trigger: linksSection,
    start: 'top 90%',
    once: true,
    onEnter: async () => {
      linksSection.style.visibility = 'visible'
      gsap.to(linksSection, { opacity: 1, duration: 0.2 })

      await new Promise((resolve) => {
        gsap.to(linksCmd, {
          duration: 0.4 * speedMult,
          text: { value: 'links' },
          ease: 'none',
          onComplete: resolve,
        })
      })

      // Scramble reveal each link
      for (let i = 0; i < LINKS.length; i++) {
        await scrambleReveal(linkEls[i], LINKS[i].label, { duration: 500 })
      }

      // Show terminal end
      revealEnd()
    },
  })
}

function revealEnd() {
  const termEnd = document.getElementById('terminal-end')
  const eof = document.getElementById('eof')

  termEnd.style.visibility = 'visible'
  gsap.to(termEnd, { opacity: 1, duration: 0.3 })

  // EOF appears on scroll
  ScrollTrigger.create({
    trigger: eof,
    start: 'top 95%',
    once: true,
    onEnter: () => {
      eof.style.visibility = 'visible'
      gsap.to(eof, { opacity: 1, duration: 1.5 })
    },
  })
}
