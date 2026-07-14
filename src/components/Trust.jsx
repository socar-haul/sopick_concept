import { Icon } from '../icons.jsx'
import { asset } from '../data.js'
import { useReveal } from '../hooks.js'

const FEATURES = [
  { icon: 'shieldCheck', title: '실매물 검수', desc: '전문 검수원이 직접 실물 확인 후 등록' },
  { icon: 'docShield', title: '보험/정비/세금 포함', desc: '복잡한 비용 걱정 없이 필요한 항목 모두 포함' },
  { icon: 'infinity', title: '월 주행거리 무제한', desc: '주행거리 제한 없이 마음껏 이용 가능' },
  { icon: 'smartkey', title: '앱스마트키 제공', desc: '스마트폰으로 차량 잠금/해제, 시동까지 간편하게' },
]

const STEPS = [
  { icon: 'sliders', title: '조건 선택', desc: '원하는 차종, 예산, 계약 조건을 선택하세요' },
  { icon: 'car', title: '차량 비교', desc: '실매물 기반으로 최적의 차량을 비교하세요' },
  { icon: 'card', title: '월요금 결제', desc: '간편한 결제로 이용을 시작하세요' },
  { icon: 'smartkey', title: '스마트키 사용', desc: '앱스마트키로 바로 이용하세요' },
]

function SampleCard() {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex flex-1 items-center gap-4 min-w-[240px]">
          <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-soft">
            <img src={asset('cars/car789.png')} alt="테슬라 모델 Y" className="h-16 object-contain" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.08em] text-faint">TESLA</p>
            <h4 className="text-base font-extrabold text-ink">Tesla 모델 Y</h4>
            <p className="text-[13px] font-medium text-sub">롱레인지 AWD 2025</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {['5인승', '전기', 'SUV', '19인치 휠'].map((t) => (
                <span key={t} className="rounded bg-soft px-1.5 py-0.5 text-[11px] font-semibold text-sub">{t}</span>
              ))}
            </div>
            <button type="button" className="mt-3 rounded-lg border border-primary/40 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary-soft">
              상세 정보 보기
            </button>
          </div>
        </div>

        <ul className="flex-1 space-y-3 min-w-[220px]">
          <li className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 font-semibold text-sub">
              <Icon name="checkCircle" size={16} className="text-primary" />
              재고 확인
            </span>
            <span className="rounded-full bg-mint-soft px-2.5 py-1 text-xs font-bold text-mint">확인 완료</span>
          </li>
          <li className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 font-semibold text-sub">
              <Icon name="calendar" size={16} className="text-primary" />
              출고 가능일
            </span>
            <span className="text-sm font-extrabold text-ink tabular-nums">D+2 (7/15)</span>
          </li>
          <li className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 font-semibold text-sub">
              <Icon name="won" size={16} className="text-primary" />
              포함 비용
            </span>
            <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">모두 포함</span>
          </li>
        </ul>
      </div>

      <p className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3.5 text-[13px] font-semibold text-sub">
        <span className="flex items-center gap-1.5">
          <Icon name="shieldCheck" size={15} className="text-mint" />
          SOPICK 검수 기준을 통과한 실매물입니다
        </span>
        <span className="font-medium text-faint">검수일 2026.07.08</span>
      </p>
    </div>
  )
}

export default function Trust() {
  const ref = useReveal()

  return (
    <section ref={ref} className="bg-soft/70 py-20 md:py-24">
      <div className="shell">
        <div className="reveal text-center">
          <h2 className="text-[28px] font-extrabold tracking-tight text-ink sm:text-[36px]">
            <span className="text-primary">SOPICK</span>은 믿을 수 있어요
          </h2>
          <p className="mt-3 text-[15px] font-medium text-sub sm:text-base">
            실매물 확인부터 결제, 앱스마트키까지 한 번에 관리합니다
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          {/* 믿을 수 있는 SOPICK */}
          <div className="reveal">
            <h3 className="text-lg font-extrabold text-ink">믿을 수 있는 SOPICK</h3>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-2xl border border-line bg-white p-4 text-center transition-shadow hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)]">
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Icon name={f.icon} size={21} />
                  </span>
                  <p className="mt-3 text-[13px] font-extrabold text-ink">{f.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed font-medium text-sub">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <SampleCard />
            </div>
          </div>

          {/* 이용가이드 */}
          <div className="reveal">
            <h3 className="text-lg font-extrabold text-ink">이용가이드</h3>
            <ol className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:gap-x-2">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative text-center">
                  {i < STEPS.length - 1 && (
                    <span aria-hidden="true" className="absolute top-4 left-[calc(50%+30px)] hidden h-px w-[calc(100%-60px)] border-t border-dashed border-faint/60 sm:block" />
                  )}
                  <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white">
                    {i + 1}
                  </span>
                  <span className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-[0_4px_14px_rgba(16,24,40,0.08)]">
                    <Icon name={s.icon} size={22} />
                  </span>
                  <p className="mt-3 text-sm font-extrabold text-ink">{s.title}</p>
                  <p className="mx-auto mt-1.5 max-w-[130px] text-xs leading-relaxed font-medium text-sub">{s.desc}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-soft/60 p-5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                <Icon name="shieldCheck" size={18} />
              </span>
              <div className="text-sm">
                <p className="font-extrabold text-ink">이용 중에도 언제든지 차량 변경, 반납, 연장이 가능합니다.</p>
                <p className="mt-1 font-medium text-sub">고객센터를 통해 빠르고 친절하게 도와드립니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
