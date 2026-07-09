import { useEffect, useRef } from "react"

const SCENE_CONFIG = {
  day: {
    Clear: { bg: ["#FF6B35", "#F7931E", "#FFD700"], orbs: ["#ffad60", "#ffe08a", "#ff8c42"] },
    Clouds: { bg: ["#4a5568", "#718096", "#a0aec0"], orbs: ["#90a4ae", "#cfd8dc", "#78909c"] },
    Rain: { bg: ["#1a365d", "#2a4a7f", "#2c5282"], orbs: ["#4a7fa5", "#2c5282", "#90cdf4"] },
    Thunderstorm: { bg: ["#1a0a3d", "#2d1b69", "#4a1a8a"], orbs: ["#7c3aed", "#a78bfa", "#4c1d95"] },
    Snow: { bg: ["#e8eaf6", "#c5cae9", "#9fa8da"], orbs: ["#ffffff", "#c5cae9", "#e8eaf6"] },
    Haze: { bg: ["#d4a853", "#c49a3c", "#b8860b"], orbs: ["#d4a853", "#f5deb3", "#8b6914"] },
    Smoke: { bg: ["#5d4037", "#4e342e", "#3e2723"], orbs: ["#8d6e63", "#a1887f", "#6d4c41"] },
  },
  night: {
    Clear: { bg: ["#0a0a2e", "#1a1a4e", "#0d0d3b"], orbs: ["#3730a3", "#1e1b4b", "#4338ca"] },
    Clouds: { bg: ["#1a1a2e", "#2d2d44", "#1f1f35"], orbs: ["#374151", "#4b5563", "#1f2937"] },
    Rain: { bg: ["#0d1b2a", "#1b2838", "#0a1628"], orbs: ["#1e3a5f", "#2c4a6e", "#0f2a47"] },
    Thunderstorm: { bg: ["#0a0a1a", "#1a0a2e", "#0d0520"], orbs: ["#4c1d95", "#2e1065", "#7c3aed"] },
    Snow: { bg: ["#1a1a3e", "#2a2a5e", "#1f1f4a"], orbs: ["#3730a3", "#4338ca", "#312e81"] },
    Haze: { bg: ["#2a1f0a", "#3a2f1a", "#1f150a"], orbs: ["#78350f", "#92400e", "#451a03"] },
    Smoke: { bg: ["#1a0f0a", "#2a1f1a", "#0f0a05"], orbs: ["#44403c", "#57534e", "#292524"] },
  }
}

const FALLBACK = {
  day: { bg: ["#2d3561", "#4a5568", "#2d3561"], orbs: ["#4f8eff", "#a78bfa", "#06b6d4"] },
  night: { bg: ["#0a0a2e", "#1a1a4e", "#0a0a2e"], orbs: ["#3730a3", "#1e1b4b", "#4338ca"] },
}

function Background({ condition, is_day , isDark}) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  const timeKey = is_day ? "day" : "night"
  const scene = SCENE_CONFIG[timeKey]?.[condition] ?? FALLBACK[timeKey]
  const bgGrad = `linear-gradient(to bottom, ${scene.bg[0]}, ${scene.bg[1]}, ${scene.bg[2]})`

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    // Resize canvas to fill screen
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Build 3 orbs from scene colors
    const orbs = scene.orbs.map((color, i) => ({
      x: (i + 1) * window.innerWidth / 4,
      y: (i % 2 === 0 ? 0.3 : 0.6) * window.innerHeight,
      r: 350 + i * 80,
      color,
      dx: (0.15 + i * 0.08) * (i % 2 === 0 ? 1 : -1),
      dy: (0.10 + i * 0.05) * (i % 2 === 0 ? -1 : 1),
      phase: i * Math.PI * 0.66,
    }))

    let t = 0

    const draw = () => {
      t += 0.014
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      orbs.forEach(orb => {
        // Gentle sine drift
        const ox = orb.x + Math.sin(t + orb.phase) * 180
        const oy = orb.y + Math.cos(t * 0.7 + orb.phase) * 120

        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r)
        grad.addColorStop(0, orb.color + "CC")  // ~80% opacity
        grad.addColorStop(0.5, orb.color + "66")  // ~40%
        grad.addColorStop(1, orb.color + "00")  // transparent

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(ox, oy, orb.r, 0, Math.PI * 2)
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [condition, is_day])

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, transition: "background 2s ease", background: bgGrad }}>
      {!isDark && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(255,255,255,0.35)",
          backdropFilter: "brightness(1.2)",
          transition: "all 0.5s ease"
        }} />
      )}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: isDark ? 1: 0.5 }}
      />
    </div>
  )
}

export default Background