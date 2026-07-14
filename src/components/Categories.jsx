import { useState } from 'react'
import { Icon } from '../icons.jsx'
import { CATEGORY_FEATURES, asset, carById, fmtFee } from '../data.js'
import { useReveal } from '../hooks.js'

function FeaturedCard({ feature }) {
  const car = carById(feature.carId)
  /* 모델 Y 디테일 컷은 배경에 회색 패턴이 박혀 있어 가장자리를 페이드 처리 */
  const maskCls =
    car.id === 'modely'
      ? '[mask-image:radial-gradient(ellipse_62%_58%_at_50%_52%,black_52%,transparent_78%)]'
      : ''
  return (
    <article
      className="relative flex min-h-[212px] flex-col justify-between overflow-hidden rounded-2xl bg-navy p-6 text-white"
      style={{ background: 'linear-gradient(140deg, #14264a 0%, #0f1b2e 55%, #0a1422 100%)' }}
    >
      {/* 모델명 + 가격 */}
      <div className="relative z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold">
          <Icon name={feature.icon} size={13} />
          {feature.eyebrow}
        </span>
        <h3 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-[28px]">{feature.name}</h3>
        <p className="mt-1.5 text-[13px] font-medium text-white/60">{feature.meta}</p>
        <div className="mt-3 flex items-end gap-1">
          <span className="mb-0.5 text-sm font-semibold text-white/70">월</span>
          <span className="text-[32px] leading-none font-extrabold tabular-nums">{fmtFee(car.fee24)}</span>
          <span className="text-base font-bold">만원부터</span>
          <Icon name="info" size={14} className="mb-1 ml-0.5 text-white/50" />
        </div>
      </div>

      {/* 차량 디테일 컷 — 데스크탑: 우측 배치 */}
      <img
        key={car.id}
        src={car.detailImg || car.img}
        alt={`${car.brand} ${car.model}`}
        className={`hero-drive pointer-events-none absolute top-1/2 right-[-2%] hidden w-[56%] max-w-[330px] -translate-y-1/2 drop-shadow-[0_24px_28px_rgba(0,0,0,0.5)] lg:block ${maskCls}`}
      />
      {/* 모바일: 인라인 배치 */}
      <img
        src={car.detailImg || car.img}
        alt=""
        className={`pointer-events-none mx-auto my-1 w-[80%] max-w-[360px] drop-shadow-[0_18px_20px_rgba(0,0,0,0.45)] lg:hidden ${maskCls}`}
      />

      <a
        href="#pricing"
        className="relative z-10 mt-4 inline-flex items-center gap-1 text-sm font-bold text-white/80 transition-colors hover:text-white"
      >
        카테고리 보기
        <Icon name="chevronRight" size={14} />
      </a>
    </article>
  )
}

function MiniCard({ icon, title, desc, children }) {
  /* 모바일: 텍스트 좌 + 이미지 우 가로형 / 데스크탑(lg): 세로형 */
  return (
    <article className="flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-line bg-soft/70 p-4 transition-shadow hover:shadow-[0_8px_28px_rgba(16,24,40,0.08)] sm:p-5 lg:flex-col lg:items-stretch lg:gap-2">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <Icon name={icon} size={15} />
          </span>
          <h3 className="text-base font-extrabold text-ink">{title}</h3>
        </div>
        <p className="mt-1.5 text-[13px] font-medium text-sub">{desc}</p>
        <a href="#pricing" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark">
          카테고리 보기
          <Icon name="chevronRight" size={13} />
        </a>
      </div>
      <div className="relative shrink-0 lg:self-end">{children}</div>
    </article>
  )
}

export default function Categories() {
  const [active, setActive] = useState(CATEGORY_FEATURES[0].key)
  const feature = CATEGORY_FEATURES.find((f) => f.key === active)
  const ref = useReveal()

  return (
    <section ref={ref} className="shell pt-20 pb-6 md:pt-24" id="categories">
      <div className="reveal">
        <h2 className="text-[26px] font-extrabold tracking-tight text-ink sm:text-[32px]">
          인기 카테고리로 빠르게 찾기
        </h2>
        <p className="mt-2 text-[15px] font-medium text-sub">
          차종, 연료, 출고 방식별로 실매물을 바로 탐색하세요
        </p>
      </div>

      {/* 카테고리 칩 */}
      <div className="reveal no-scrollbar -mx-5 mt-7 flex gap-2.5 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0" role="tablist" aria-label="인기 카테고리">
        {CATEGORY_FEATURES.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={active === f.key}
            onClick={() => setActive(f.key)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
              active === f.key
                ? 'bg-primary text-white shadow-[0_6px_16px_rgba(27,91,242,0.3)]'
                : 'border border-line bg-white text-sub hover:border-faint hover:text-ink'
            }`}
          >
            <Icon name={f.icon} size={16} />
            {f.label}
          </button>
        ))}
      </div>

      {/* 카테고리 그리드 — 50% : 25% : 25% 가로 정렬 */}
      <div className="reveal mt-6 grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
        <FeaturedCard feature={feature} />

        <MiniCard icon="car" title="24시간 배송" desc="공식 재고, 즉시 인도 가능한 신차">
          <div className="relative h-[70px] w-[128px]">
            <img src={asset('cars/car812.png')} alt="" className="absolute top-0 right-0 w-[84px] opacity-80" />
            <img src={asset('cars/car689.png')} alt="" className="absolute bottom-0 left-0 w-[92px] drop-shadow-md" />
          </div>
        </MiniCard>
        <MiniCard icon="globe" title="중고 수입차" desc="프리미엄 수입차를 합리적인 가격에">
          <img src={asset('cars/car810.png')} alt="" className="w-[112px] drop-shadow-md" />
        </MiniCard>
      </div>

      {/* 하단 요약 */}
      <div className="reveal mt-6 flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-sub">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <Icon name="search" size={15} />
            전체 재고 <strong className="font-extrabold text-ink">1,258대</strong>
          </span>
          <span className="text-faint">업데이트 5분 전</span>
          <button type="button" aria-label="재고 새로고침" className="text-faint transition-colors hover:text-primary">
            <Icon name="refresh" size={15} />
          </button>
        </div>
        <a href="#pricing" className="flex items-center gap-1 font-bold text-primary hover:text-primary-dark">
          모든 카테고리 보기
          <Icon name="chevronRight" size={14} />
        </a>
      </div>
    </section>
  )
}
