"use client";
import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  opacity: number
  pulseSpeed: number
  pulse: number
  currentRadius: number
}

const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number | undefined

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Particle configuration
    const particles: Particle[] = []
    const particleCount = 80
    const maxDistance = 150

    // Violet to Fuchsia gradient colors
    const colors = ['#7c3aed', '#8b5cf6', '#9333ea', '#a855f7', '#c026d3', '#d946ef']

    // Create particle
    const createParticle = (): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulse: 0,
        currentRadius: Math.random() * 2 + 1,
      }
    }

    // Update particle
    const updateParticle = (particle: Particle) => {
      // Move particle
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.vx = -particle.vx
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.vy = -particle.vy
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))
      }

      // Pulsing effect
      particle.pulse += particle.pulseSpeed
      particle.currentRadius = particle.radius + Math.sin(particle.pulse) * 0.5
    }

    // Draw particle
    const drawParticle = (particle: Particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.currentRadius, 0, Math.PI * 2)
      ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`
      ctx.fill()

      // Add glow effect
      ctx.shadowColor = particle.color
      ctx.shadowBlur = 10
      ctx.fill()
      ctx.shadowBlur = 0
    }

    // Initialize particles
    const initParticles = () => {
      particles.length = 0
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle())
      }
    }

    // Draw connections between nearby particles
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.4

            // Gradient line for violet-fuchsia theme
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            )
            gradient.addColorStop(0, `rgba(124, 58, 237, ${opacity})`) // Violet
            gradient.addColorStop(0.5, `rgba(192, 38, 211, ${opacity})`) // Fuchsia
            gradient.addColorStop(1, `rgba(124, 58, 237, ${opacity})`) // Violet

            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with dark background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach(particle => {
        updateParticle(particle)
        drawParticle(particle)
      })

      // Draw connections
      drawConnections()

      animationId = requestAnimationFrame(animate)
    }

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = event.clientX
      const mouseY = event.clientY

      particles.forEach(particle => {
        const dx = mouseX - particle.x
        const dy = mouseY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          const force = (100 - distance) / 100
          particle.vx += (dx / distance) * force * 0.01
          particle.vy += (dy / distance) * force * 0.01
        }
      })
    }

    // Initialize
    resizeCanvas()
    initParticles()
    animate()

    // Event listeners
    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #0f0720 0%, #2e1065 25%, #4c1d95 50%, #2e1065 75%, #0f0720 100%)'
      }}
    />
  )
}

export default Background
