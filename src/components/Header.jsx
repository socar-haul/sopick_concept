import { useEffect, useState } from 'react'
import { Icon } from '../icons.jsx'

const NAV = ['실매물', '구독견적', '중고차', '고객센터']

function Logo() {
  return (
    <a href="#" className="flex flex-col leading-none" aria-label="SOPICK 마켓플레이스 홈">
      <span className="text-[22px] font-extrabold tracking-tight text-primary">SOPICK</span>
    </a>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-shadow ${
        scrolled ? 'border-line shadow-[0_1px_12px_rgba(16,24,40,0.06)]' : 'border-transparent'
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">
          {NAV.map((item, i) => (
            <a
              key={item}
              href="#"
              className={`rounded-lg px-4 py-2 text-[15px] font-semibold transition-colors hover:bg-soft hover:text-ink ${
                i === 0 ? 'text-ink' : 'text-sub'
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <a
            href="#"
            className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold text-sub transition-colors hover:border-faint hover:text-ink"
          >
            <Icon name="user" size={16} />
            로그인
          </a>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink md:hidden"
          aria-expanded={open}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} size={22} />
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-white md:hidden" aria-label="모바일 메뉴">
          <div className="shell flex flex-col py-2">
            {NAV.map((item) => (
              <a
                key={item}
                href="#"
                className="rounded-lg px-3 py-3 text-[15px] font-semibold text-ink hover:bg-soft"
                onClick={() => setOpen(false)}
              >
                {item}
              </a>
            ))}
            <a href="#" className="mt-1 mb-2 flex items-center gap-1.5 rounded-lg px-3 py-3 text-[15px] font-semibold text-sub hover:bg-soft">
              <Icon name="user" size={16} />
              로그인
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
