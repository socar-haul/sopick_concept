import { useMemo, useState } from 'react'
import { Icon } from '../icons.jsx'
import { BUDGETS, CARS, TERM_FACTOR, TYPE_META, fmtFee } from '../data.js'
import { useReveal } from '../hooks.js'

const TERMS = [12, 24, 36, 60]

function CarCard({ car, term, compared, similar, onToggleCompare }) {
  const meta = TYPE_META[car.type]
  const fee = fmtFee(car.fee24, term)

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(16,24,40,0.12)]">
      {/* 이미지 영역 */}
      <div className="relative overflow-hidden bg-soft/70 px-4 pt-11 pb-2">
        <span className={`absolute top-3 left-3 z-10 rounded-md px-2.5 py-1 text-xs font-bold ${meta.chip}`}>
          {meta.label}
        </span>
        <span className={`absolute top-3 right-3 z-10 rounded-md px-2.5 py-1 text-xs font-bold ${meta.subChip}`}>
          {car.lead}
        </span>
        {similar && (
          <span className="absolute bottom-3 left-3 z-10 rounded-md bg-[#fff1df] px-2.5 py-1 text-xs font-bold text-amber">
            비슷한 예산
          </span>
        )}
        <img
          src={car.img}
          alt={`${car.brand} ${car.model} ${car.trim}`}
          className="mx-auto -my-8 h-64 max-w-none object-contain"
        />
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold tracking-[0.08em] text-faint uppercase">{car.brand}</p>
        <h3 className="mt-1 text-lg font-extrabold text-ink">{car.model}</h3>
        <p className="mt-0.5 truncate text-[13px] font-medium text-sub">
          {car.trim}
          {car.year && ` · ${car.year}년 · ${car.odo}`}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-soft px-2 py-1 text-xs font-semibold text-sub">{car.fuel}</span>
          <span className="rounded-md bg-soft px-2 py-1 text-xs font-semibold text-sub">{car.seats}인승</span>
          <span className="rounded-md bg-soft px-2 py-1 text-xs font-semibold text-sub">{car.segment}</span>
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <p className="text-xs font-semibold text-sub">월 요금</p>
          <p className="mt-1 flex items-baseline gap-0.5">
            <strong className="text-[28px] leading-none font-extrabold text-primary tabular-nums">{fee}</strong>
            <span className="text-base font-extrabold text-primary">만원</span>
          </p>
          <p className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-faint">
            <Icon name="checkCircle" size={12} className="shrink-0 text-mint" />
            보험/정비/세금 포함
            <Icon name="checkCircle" size={12} className="ml-1 shrink-0 text-mint" />
            월 주행거리 무제한
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <label className={`flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border text-[13px] font-bold transition-colors ${
            compared ? 'border-primary bg-primary-soft text-primary' : 'border-line text-sub hover:border-faint'
          }`}>
            <input
              type="checkbox"
              checked={compared}
              onChange={() => onToggleCompare(car.id)}
              className="h-3.5 w-3.5 accent-[#0069ff]"
            />
            비교 담기
          </label>
          <button
            type="button"
            className="flex h-10 flex-1 items-center justify-center gap-1 rounded-lg bg-primary text-[13px] font-bold text-white transition-colors hover:bg-primary-dark"
          >
            자세히 보기
            <Icon name="arrowRight" size={13} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Pricing({ compareIds, onToggleCompare }) {
  const [budget, setBudget] = useState('b120')
  const [term, setTerm] = useState(24)
  const ref = useReveal()

  /* 예산에 맞는 매물 + 3대 미만이면 가장 가까운 요금의 매물로 채움 */
  const { shown, matchCount } = useMemo(() => {
    const b = BUDGETS.find((x) => x.key === budget)
    const inBudget = (fee) => fee > b.min && fee <= b.max
    const gap = (fee) => (fee <= b.min ? b.min - fee : fee > b.max ? fee - b.max : 0)

    const matches = CARS.filter((c) => inBudget(c.fee24 * TERM_FACTOR[term]))
      .sort((a, c) => a.fee24 - c.fee24)
      .map((car) => ({ car, similar: false }))
    const fillers = CARS.filter((c) => !inBudget(c.fee24 * TERM_FACTOR[term]))
      .sort((a, c) => gap(a.fee24 * TERM_FACTOR[term]) - gap(c.fee24 * TERM_FACTOR[term]))
      .slice(0, Math.max(0, 3 - matches.length))
      .map((car) => ({ car, similar: true }))

    return { shown: [...matches, ...fillers], matchCount: matches.length }
  }, [budget, term])

  return (
    <section ref={ref} className="shell pt-16 pb-20 md:pt-20" id="pricing">
      <div className="reveal flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[26px] font-extrabold tracking-tight text-ink sm:text-[32px]">
            월 요금별 인기차종
          </h2>
          <p className="mt-2 text-[15px] font-medium text-sub">
            예산을 고르면 24시간 배송, 신차 주문, 중고차를 함께 비교합니다
          </p>
        </div>
        <button
          type="button"
          className="h-10 rounded-full border border-line px-5 text-sm font-bold text-ink transition-colors hover:border-faint"
        >
          전체 보기
        </button>
      </div>

      <div className="reveal mt-7 grid gap-5 lg:grid-cols-[248px_1fr]">
        {/* 사이드바 필터 */}
        <aside className="h-fit rounded-2xl border border-line bg-white p-5">
          <h3 className="text-sm font-extrabold text-ink">
            예산 선택 <span className="font-semibold text-faint">(월 요금 기준)</span>
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1" role="radiogroup" aria-label="예산 선택">
            {BUDGETS.map((b) => (
              <button
                key={b.key}
                role="radio"
                aria-checked={budget === b.key}
                onClick={() => setBudget(b.key)}
                className={`flex h-11 items-center justify-between rounded-xl border px-3.5 text-sm font-bold transition-colors ${
                  budget === b.key
                    ? 'border-primary bg-primary-soft text-primary'
                    : 'border-line text-sub hover:border-faint hover:text-ink'
                }`}
              >
                {b.label}
                {budget === b.key ? (
                  <Icon name="checkCircle" size={17} />
                ) : (
                  b.hot && <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-bold text-primary">인기</span>
                )}
              </button>
            ))}
          </div>

          <h3 className="mt-6 flex items-center gap-1 text-sm font-extrabold text-ink">
            계약 기간 <Icon name="info" size={13} className="text-faint" />
          </h3>
          <div className="mt-3 grid grid-cols-4 gap-1 rounded-xl bg-soft p-1" role="radiogroup" aria-label="계약 기간">
            {TERMS.map((t) => (
              <button
                key={t}
                role="radio"
                aria-checked={term === t}
                onClick={() => setTerm(t)}
                className={`h-9 rounded-lg text-[13px] font-bold transition-all ${
                  term === t ? 'bg-primary text-white shadow-sm' : 'text-sub hover:text-ink'
                }`}
              >
                {t}개월
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-primary-soft/70 p-4">
            <p className="flex items-center gap-1.5 text-[13px] font-extrabold text-primary">
              <Icon name="shieldCheck" size={15} />
              모든 차량 동일 조건
            </p>
            <ul className="mt-2.5 space-y-1.5 text-[13px] font-semibold text-sub">
              <li className="flex items-center gap-1.5">
                <Icon name="check" size={13} className="text-primary" />
                보험/정비/세금 포함
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="check" size={13} className="text-primary" />
                월 주행거리 무제한
              </li>
            </ul>
          </div>
        </aside>

        {/* 차량 카드 */}
        <div>
          <p className="mb-3 text-sm font-semibold text-sub" aria-live="polite">
            이 조건의 실매물 <strong className="font-extrabold text-primary">{matchCount}대</strong>
            {matchCount < shown.length && (
              <span className="ml-1.5 text-faint">+ 비슷한 예산 {shown.length - matchCount}대</span>
            )}
            <span className="ml-2 text-faint">· {term}개월 계약 기준 월 요금</span>
          </p>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {shown.map(({ car, similar }) => (
              <CarCard
                key={car.id}
                car={car}
                term={term}
                similar={similar}
                compared={compareIds.includes(car.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="reveal mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-5 text-[13px] font-medium text-faint">
        <p>
          · 월 요금은 선택한 계약 기간 기준이며, 초기비용 0원 조건입니다 &nbsp;· 신차 주문 차량은 제조사 상황 및 인기 사양에 따라 일정이 변동될 수 있습니다
        </p>
        <a href="#" className="flex items-center gap-1 font-bold text-primary hover:text-primary-dark">
          월 요금 구성 보기
          <Icon name="chevronRight" size={13} />
        </a>
      </div>
    </section>
  )
}
