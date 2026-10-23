'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  Flame,
  Gamepad2,
  Grid3X3,
  Info,
  Menu,
  Play,
  Search,
  Settings2,
  Sparkles,
  Swords,
  Trophy,
  Users,
  X,
  Zap,
} from 'lucide-react'

export default function Page() {
  const [search, setSearch] = useState('')
  const [vault, setVault] = useState<string[]>(['Neon Blade: Reborn'])
  const [xp, setXp] = useState(2840)
  const [notice, setNotice] = useState('Welcome to Arcadia Games — Level 24 Explorer')

  useEffect(() => {
    const timer = setTimeout(() => setNotice(''), 3000)
    return () => clearTimeout(timer)
  }, [])

  const triggerWarp = () => {
    setXp((prev) => prev + 150)
    setNotice('⚡ Dimensional Warp Triggered! +150 XP')
    setTimeout(() => setNotice(''), 2500)
  }

  return (
    <main className="arcadia-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark"><span /></span>
          <span>arcadia<span className="brand-dot">.</span></span>
        </div>
        <div className="profile-mini">
          <div className="avatar">A</div>
          <div><strong>Arcadia Player</strong><span>Level 24 · Explorer</span></div>
          <ChevronDown size={15} />
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          <p className="nav-label">DISCOVER</p>
          <Link href="/" className="nav-link active"><Home size={18} />Home</Link>
          <Link href="/games" className="nav-link"><Gamepad2 size={18} />All Games <span className="nav-count">1.5k</span></Link>
          <Link href="/categories" className="nav-link"><Grid3X3 size={18} />Categories</Link>
          
          <p className="nav-label space">YOUR SPACE</p>
          <a className="nav-link"><Bookmark size={18} />My Vault <span className="nav-count">{vault.length}</span></a>
          <a className="nav-link"><Trophy size={18} />Achievements</a>
          <a className="nav-link"><BarChart3 size={18} />Stats</a>
          
          <p className="nav-label space">COMMUNITY</p>
          <a className="nav-link"><Users size={18} />Friends <span className="online-dot" /></a>
          <a className="nav-link"><Info size={18} />About Arcadia</a>
        </nav>
        <div className="sidebar-foot">
          <div className="streak">
            <Flame size={18} fill="currentColor" />
            <div><strong>7 day streak</strong><span>Keep it going!</span></div>
            <ArrowRight size={16} />
          </div>
          <div className="side-foot-links"><Settings2 size={15} />Settings <span>·</span> Help</div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu"><Menu /></button>
          <div className="search-wrap">
            <Search size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search games, genres, anime vibes..." />
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications"><Bell size={18} /><i /></button>
            <div className="xp">
              <span>XP {xp} / 3,200</span>
              <div><b style={{ width: `${(xp / 3200) * 100}%` }} /></div>
            </div>
            <div className="avatar small">A</div>
          </div>
        </header>

        <div className="page-inner">
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow"><span className="pulse" /> 1,247 players online now</div>
              <h1>Play something<br /><em>legendary.</em></h1>
              <p>Zero downloads. Zero waiting. Just press play<br />and enter your next favorite browser world.</p>
              <button className="primary-button" onClick={triggerWarp}>
                <Play size={16} fill="currentColor" /> Play a random game <Zap size={15} />
              </button>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="spark s1">✦</div>
              <div className="spark s2">✧</div>
              <div className="spark s3">+</div>
              <div className="hero-orb" onClick={triggerWarp} style={{ cursor: 'pointer' }}>
                <Swords size={78} strokeWidth={1.2} />
                <span>ENTER<br />THE RIFT</span>
              </div>
            </div>
          </section>

          <section className="section-head">
            <div>
              <div className="section-kicker"><Sparkles size={14} /> CURATED FOR YOU</div>
              <h2>Find your next obsession</h2>
            </div>
            <Link href="/games" className="text-button">View all <ArrowRight size={16} /></Link>
          </section>
        </div>
      </section>

      {notice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg bg-[#27222e] border border-[#80506e] px-4 py-3 text-xs text-[#f9c2d6] shadow-2xl animate-bounce">
          <Check size={16} className="text-[#35d797]" />
          {notice}
        </div>
      )}
    </main>
  )
}
