//* Componente gerado por IA apenas para fins de incrementação visual.
import { useEffect, useRef } from 'react'
import { Target } from 'lucide-react'

function FloatingOrb({
  delay,
  size,
  x,
  y,
}: {
  delay: number
  size: number
  x: number
  y: number
}) {
  return (
    <div
      className="absolute rounded-full opacity-20 blur-3xl"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: 'oklch(0.55 0.2 260)',
        animation: `float ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  )
}

function GridLines() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.06]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Background grid lines</title>
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )
}

function AnimatedRing({ delay, size }: { delay: number; size: number }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
      style={{
        width: size,
        height: size,
        animation: `pulse-ring ${4 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  )
}

export default function LoginDecoration() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div
      className="relative hidden h-full w-full overflow-hidden lg:block"
      style={{ background: 'oklch(0.17 0.03 270)' }}
    >
      <GridLines />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <FloatingOrb delay={0} size={300} x={20} y={15} />
      <FloatingOrb delay={2} size={200} x={70} y={60} />
      <FloatingOrb delay={4} size={250} x={40} y={80} />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-12">
        <AnimatedRing delay={0} size={200} />
        <AnimatedRing delay={1} size={280} />
        <AnimatedRing delay={2} size={360} />

        <div
          className="flex flex-col items-center gap-6"
          style={{ animation: 'fade-up 1s ease-out' }}
        >
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 backdrop-blur-sm"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <Target className="h-10 w-10 text-white/80" />
          </div>

          <div className="text-center">
            <h2
              className="text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              CRM Belone
            </h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">
              Gerencie seus contatos, oportunidades e relacionamentos em um
              unico lugar.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-1.5 rounded-full"
              style={{
                width: i === 1 ? 32 : 12,
                background:
                  i === 1 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
