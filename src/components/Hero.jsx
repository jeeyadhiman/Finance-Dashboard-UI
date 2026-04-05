import { useEffect, useRef } from 'react'
import './Hero.css'
import { useNavigate } from "react-router-dom";

const floatingCoins = [
  { top: '14%', left: '6%', size: 36, delay: 0, duration: 5.5 },
  { top: '28%', left: '38%', size: 28, delay: 1.2, duration: 6 },
  { top: '60%', left: '4%', size: 30, delay: 0.6, duration: 7 },
  { top: '72%', left: '30%', size: 26, delay: 2, duration: 5 },
  { top: '44%', left: '58%', size: 22, delay: 1.5, duration: 6.5 },
  { top: '8%', left: '50%', size: 32, delay: 0.3, duration: 5.8 },
]

function DollarCoin({ top, left, size, delay, duration }) {
  return (
    <div
      className="floating-coin"
      style={{
        top,
        left,
        width: size,
        height: size,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke="#3a6b1e" strokeWidth="1.5" fill="#1a3510" />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="14"
          fill="#4caf50"
          fontWeight="700"
        >
          $
        </text>
      </svg>
    </div>
  )
}

function CardWidget() {
  return (
    <div className="card-wrapper">
      <div className="card-phone">
        <div className="card-notch" />
        <div className="card-screen">
          <div className="credit-card">
            <div className="credit-card-top">
              <div className="card-chip">
                <div className="chip-line" />
                <div className="chip-line" />
                <div className="chip-line" />
              </div>
            </div>

            <div className="credit-card-bottom">
              <div className="card-info">
                <span className="card-label">Platinum Card</span>
                <span className="card-number">•••• 4829</span>
              </div>

              <div className="card-balance">
                <span className="balance-label">Balance</span>
                <span className="balance-amount">₹12,480</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-glow" />
    </div>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const navigate = useNavigate(); // ✅ FIXED

  useEffect(() => {
    const els = heroRef.current?.querySelectorAll('.animate-in')
    els?.forEach((el, i) => {
      el.style.animationDelay = `${0.1 + i * 0.12}s`
      el.classList.add('visible')
    })
  }, [])

  return (
    <section className="hero" ref={heroRef}>
      
      <div className="noise-overlay" />
      <div className="bg-glow-left" />
      <div className="bg-glow-right" />
      <div className="grid-lines" />

      {floatingCoins.map((coin, i) => (
        <DollarCoin key={i} {...coin} />
      ))}

      {/* LEFT */}
      <div className="hero-left animate-in">
        <CardWidget />
      </div>

      {/* RIGHT */}
      <div className="hero-right">

        <div className="badge animate-in">
          <span>SMART FINANCE DASHBOARD</span>
        </div>

        <h1 className="hero-title animate-in">
          Your Money,{" "}
          <span className="title-accent">
            Beautifully<br />Clear
          </span>
        </h1>

        <p className="hero-desc animate-in">
          Track income, expenses, and insights with an immersive dashboard experience.
        </p>

        <div className="hero-actions animate-in">
          
          {/* ✅ FIXED BUTTON */}
          <button 
            className="btn-primary"
            onClick={() => navigate("/dashboard")}
          >
            Explore Dashboard →
          </button>

          <button 
            className="btn-outline"
            onClick={() => navigate("/dashboard")}
          >
            View Transactions
          </button>

        </div>

      </div>
    </section>
  )
}