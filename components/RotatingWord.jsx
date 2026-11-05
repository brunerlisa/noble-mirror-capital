'use client'
import { useState, useEffect } from 'react'

const words = ['everyone', 'experts', 'investor']

export default function RotatingWord({ className = '' }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
    }, 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <span className={`inline-block min-w-[8.2ch] align-baseline text-amber-400 ${className}`}>
      <span key={words[index]} className="hero-word-in inline-block whitespace-nowrap">
        {words[index]}
      </span>
    </span>
  )
}
