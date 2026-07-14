import { Icon } from '../icons.jsx'

const LINK_GROUPS = [
  { title: '회사소개', links: ['서비스 소개', 'SOPICK 스토리', '제휴/파트너십'] },
  { title: '이용약관', links: ['이용약관', '개인정보처리방침'] },
  { title: '고객센터', links: ['자주 묻는 질문', '1:1 문의', '이용 가이드'] },
  { title: '법인문의', links: ['법인 전용 혜택', '대량/장기 이용 문의'] },
]

function StoreButton({ store }) {
  const isApple = store === 'apple'
  return (
    <a
      href="#"
      className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 transition-colors hover:bg-white/10"
    >
      {isApple ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.05 12.54c-.03-2.89 2.36-4.27 2.47-4.34-1.35-1.97-3.44-2.24-4.18-2.27-1.78-.18-3.47 1.05-4.37 1.05-.9 0-2.29-1.02-3.77-1-1.94.03-3.72 1.13-4.72 2.86-2.01 3.49-.51 8.66 1.45 11.5.96 1.39 2.1 2.95 3.6 2.89 1.45-.06 2-.93 3.75-.93s2.24.93 3.77.9c1.56-.03 2.55-1.42 3.5-2.81 1.1-1.61 1.55-3.17 1.58-3.25-.03-.02-3.03-1.17-3.08-4.6zM14.16 4.06c.8-.97 1.34-2.32 1.19-3.66-1.15.05-2.55.77-3.38 1.74-.74.85-1.39 2.23-1.22 3.54 1.29.1 2.6-.65 3.41-1.62z" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3.6 1.8c-.35.37-.55.94-.55 1.68v17.07c0 .74.2 1.31.56 1.67l.09.08 9.57-9.56v-.22L3.7 1.72l-.1.08z" />
          <path d="m16.46 15.93-3.19-3.19v-.22l3.19-3.19.07.04 3.78 2.15c1.08.61 1.08 1.61 0 2.23l-3.78 2.14-.07.04z" opacity=".8" />
          <path d="m16.53 15.89-3.26-3.26L3.6 22.3c.36.38.94.42 1.6.05l11.33-6.46" opacity=".6" />
          <path d="M16.53 8.37 5.2 1.93c-.66-.38-1.24-.33-1.6.05l9.67 9.66 3.26-3.27z" opacity=".9" />
        </svg>
      )}
      <span className="text-left leading-none">
        <span className="block text-[9px] font-medium text-white/50">
          {isApple ? 'Download on the' : 'GET IT ON'}
        </span>
        <span className="mt-0.5 block text-[13px] font-bold">{isApple ? 'App Store' : 'Google Play'}</span>
      </span>
    </a>
  )
}

const SOCIALS = ['N', 'I', 'Y', 'B']

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_2.4fr_1fr] lg:gap-14">
          {/* 브랜드 */}
          <div>
            <p className="text-2xl font-extrabold tracking-tight text-white">SOPICK</p>
            <p className="mt-4 text-[15px] font-bold text-white/90">차량 구독을 다시, 간단하게</p>
            <p className="mt-1.5 text-[13px] leading-relaxed font-medium text-white/50">
              실매물 기반의 믿을 수 있는 차량 구독 플랫폼
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={`SOPICK ${s} 채널`}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-extrabold text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* 링크 그룹 */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {LINK_GROUPS.map((g) => (
              <nav key={g.title} aria-label={g.title}>
                <h4 className="text-sm font-extrabold text-white">{g.title}</h4>
                <ul className="mt-3.5 space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-[13px] font-medium text-white/55 transition-colors hover:text-white">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div>
              <h4 className="text-sm font-extrabold text-white">앱 다운로드</h4>
              <div className="mt-3.5 space-y-2">
                <StoreButton store="apple" />
                <StoreButton store="google" />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 lg:justify-self-end lg:w-full">
            <p className="text-[15px] font-bold text-white">지금 바로 다양한 실매물을 확인해보세요</p>
            <a
              href="#pricing"
              className="mt-4 flex h-12 items-center justify-center gap-1.5 rounded-xl bg-primary text-[15px] font-bold text-white transition-colors hover:bg-primary-dark"
            >
              실매물 둘러보기
              <Icon name="chevronRight" size={15} />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs font-medium text-white/40">
          <p>© 2026 SOPICK. 컨셉 디자인 목업 — 모든 차량 정보와 요금은 예시입니다.</p>
          <p>서울특별시 성동구 · 사업자등록번호 000-00-00000</p>
        </div>
      </div>
    </footer>
  )
}
