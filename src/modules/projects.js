import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrambleReveal } from './scramble.js'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    slug: 'internet402',
    desc: 'Solana-native HTTP 402 payment protocol for AI agents',
    tags: ['TypeScript', 'Solana'],
    github: 'nullxnothing/internet402',
    live: 'internet402.vercel.app',
  },
  {
    slug: 'quanta',
    desc: 'Agent-native market making infrastructure on Solana',
    tags: ['TypeScript', 'Solana'],
    github: 'nullxnothing/quanta',
  },
  {
    slug: 'solblade',
    desc: 'AI-native Solana wallet CLI with scoped MCP server',
    tags: ['TypeScript', 'MCP'],
    github: 'nullxnothing/solblade',
  },
  {
    slug: 'trenchlens',
    desc: 'Real-time Solana token intelligence and analytics dashboard',
    tags: ['TypeScript', 'Next.js'],
    github: 'nullxnothing/trenchlens',
    live: 'trenchlens.vercel.app',
  },
  {
    slug: 'devcred-agent',
    desc: 'Autonomous agent monitoring pump.fun launches and scoring deployer reputation',
    tags: ['TypeScript', 'AI Agent'],
    github: 'nullxnothing/devcred-agent',
  },
  {
    slug: 'nullset-wallet-recovery',
    desc: 'Reclaim rent accounts, creator rewards, and track locked tokens across wallets',
    tags: ['TypeScript', 'Solana'],
    github: 'nullxnothing/nullset-solana-wallet-recovery',
  },
]

export function renderProjects() {
  const container = document.getElementById('projects-list')

  projects.forEach((project) => {
    const el = document.createElement('div')
    el.className = 'project'
    el.setAttribute('data-animated', 'false')

    const cmd = document.createElement('div')
    cmd.className = 'project-cmd'
    cmd.innerHTML = `<span class="prompt">&gt; </span><span class="cmd-text"></span>`

    const desc = document.createElement('div')
    desc.className = 'project-desc'

    const tags = document.createElement('div')
    tags.className = 'project-tags'

    const links = document.createElement('div')
    links.className = 'project-links'

    let linksHtml = `<a href="https://github.com/${project.github}" target="_blank" rel="noopener">source</a>`
    if (project.live) {
      linksHtml += `<a href="https://${project.live}" target="_blank" rel="noopener">live</a>`
    }
    links.innerHTML = linksHtml

    el.appendChild(cmd)
    el.appendChild(desc)
    el.appendChild(tags)
    el.appendChild(links)

    // Store data for animation
    el._projectData = {
      cmd: `cat ./projects/${project.slug}`,
      desc: project.desc,
      tags: project.tags.map(t => `[${t}]`).join(' '),
    }

    container.appendChild(el)
  })

  // Set up scroll triggers
  const projectEls = container.querySelectorAll('.project')
  projectEls.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => animateProject(el),
    })
  })
}

async function animateProject(el) {
  if (el.getAttribute('data-animated') === 'true') return
  el.setAttribute('data-animated', 'true')

  const data = el._projectData
  const cmdText = el.querySelector('.cmd-text')
  const desc = el.querySelector('.project-desc')
  const tags = el.querySelector('.project-tags')
  const links = el.querySelector('.project-links')

  // Hide children initially
  desc.style.opacity = '0'
  tags.style.opacity = '0'
  links.style.opacity = '0'

  // Type the command
  await new Promise((resolve) => {
    gsap.to(cmdText, {
      duration: data.cmd.length * 0.03,
      text: { value: data.cmd },
      ease: 'none',
      onComplete: resolve,
    })
  })

  // Scramble reveal description
  desc.style.opacity = '1'
  await scrambleReveal(desc, data.desc, { duration: 800 })

  // Scramble reveal tags
  tags.style.opacity = '1'
  await scrambleReveal(tags, data.tags, { duration: 400, charSet: '[]01' })

  // Fade in links
  gsap.to(links, { opacity: 1, duration: 0.3 })
}
