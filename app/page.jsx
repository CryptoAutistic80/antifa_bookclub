'use client'

import Background3D from '../components/Background3D'
import LogoDisplay from '../components/LogoDisplay'
import AudioLoop from '../components/AudioLoop'
import './globals.css'

export default function Page() {
  return (
    <div className="app">
      <h1 className="sr-only">Anti-Fascist Book Club UK (Antifa) — A hub for educational resources, both free and paid.</h1>
      <p className="sr-only">Explore antifascist and anti-fascist reading lists, guides, and books — from free PDFs to paid titles — curated by the Anti-Fascist Book Club UK (antifa).</p>
      <Background3D />
      <LogoDisplay />
      <AudioLoop />
    </div>
  )
}
