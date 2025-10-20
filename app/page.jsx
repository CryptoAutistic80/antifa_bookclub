'use client'

import Background3D from '../components/Background3D'
import LogoDisplay from '../components/LogoDisplay'
import AudioLoop from '../components/AudioLoop'
import './globals.css'

export default function Page() {
  return (
    <div className="app">
      <Background3D />
      <LogoDisplay />
      <AudioLoop />
    </div>
  )
}
