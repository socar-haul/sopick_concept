import { useMemo, useState } from 'react'
import { Icon } from '../icons.jsx'
import { TAB_STOCK, TERM_RANGES } from '../data.js'

/* 월 요금 단일 콤보박스 — 20만원 단위 40~160만원 */
const FEE_OPTIONS = [
  { v: 'all', label: '전체', share: 1 },
  { v: '40', label: '40만원', share: 0.1 },
  { v: '60', label: '60만원', share: 0.16 },
  { v: '80', label: '80만원', share: 0.22 },
  { v: '100', label: '100만원', share: 0.18 },
  { v: '120', label: '120만원', share: 0.14 },
  { v: '140', label: '140만원', share: 0.1 },
  { v: '160', label: '160만원', share: 0.07 },
]
const SELECTS = [
  { key: 'brand', label: '브랜드', options: ['전체', '현대', '기아', '제네시스', '테슬라', 'BMW', '벤츠', '볼보', 'MINI'] },
  { key: 'model', label: '모델', options: ['전체'] },
  { key: 'segment', label: '차급', options: ['전체', '경차', '소형', '중형', '준대형', '대형', 'SUV'] },
  { key: 'avail', label: '출고 가능일', options: ['전체', '즉시 출고', '1주 이내', '1개월 이내', '3개월 이내'] },
]
/* '전체' 외 항목을 고르면 재고가 줄어드는 비율 */
const NARROW = { brand: 0.18, model: 1, segment: 0.32, avail: 0.45 }

export default function SearchPanel() {
  const [tab, setTab] = useState('stock')
  const [term, setTerm] = useState('all')
  const [fee, setFee] = useState('all')
  const [filters, setFilters] = useState({ brand: '전체', model: '전체', segment: '전체', avail: '전체' })
  const [saved, setSaved] = useState(false)

  const count = useMemo(() => {
    let n = TAB_STOCK[tab].count
    n *= TERM_RANGES.find((t) => t.key === term).share
    n *= FEE_OPTIONS.find((f) => f.v === fee).share
    for (const [key, val] of Object.entries(filters)) {
      if (val !== '전체') n *= NARROW[key]
    }
    return Math.max(2, Math.round(n))
  }, [tab, term, fee, filters])

  const selectCls =
    'select-caret h-11 w-full rounded-xl border border-line bg-white pl-3.5 pr-8 text-sm font-medium text-ink transition-colors hover:border-faint'

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_48px_rgba(16,24,40,0.14)] ring-1 ring-black/5">
      {/* 매물 유형 탭 */}
      <div role="tablist" aria-label="매물 유형" className="flex gap-1 border-b border-line bg-soft/60 px-3 pt-3">
        {Object.entries(TAB_STOCK).map(([key, t]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-sm font-bold transition-colors sm:px-5 ${
              tab === key
                ? 'bg-primary text-white shadow-sm'
                : 'text-sub hover:bg-white hover:text-ink'
            }`}
          >
            <Icon name="car" size={17} className="hidden sm:block" />
            {t.label}
          </button>
        ))}
      </div>

      {/* 필터 영역 */}
      <div className="grid gap-x-5 gap-y-4 p-5 sm:p-6 lg:grid-cols-12">
        {/* 이용 기간 */}
        <div className="lg:col-span-5">
          <div className="mb-2 flex items-center gap-1 text-[13px] font-semibold text-sub">
            이용 기간 1-60개월
            <Icon name="info" size={14} className="text-faint" />
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="이용 기간">
            {TERM_RANGES.map((t) => (
              <button
                key={t.key}
                type="button"
                aria-pressed={term === t.key}
                onClick={() => setTerm(t.key)}
                className={`h-11 rounded-xl px-3.5 text-sm font-semibold transition-colors ${
                  term === t.key
                    ? 'bg-primary-soft text-primary ring-1 ring-primary/40'
                    : 'border border-line text-sub hover:border-faint hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 월 요금 + 브랜드/모델/차급/출고일 */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-5">
          <div>
            <div className="mb-2 text-[13px] font-semibold text-sub">월 요금</div>
            <select aria-label="월 요금" className={selectCls} value={fee} onChange={(e) => setFee(e.target.value)}>
              {FEE_OPTIONS.map((o) => (
                <option key={o.v} value={o.v}>{o.label}</option>
              ))}
            </select>
          </div>
          {SELECTS.map((s) => (
            <div key={s.key}>
              <div className="mb-2 text-[13px] font-semibold text-sub">{s.label}</div>
              <select
                aria-label={s.label}
                className={selectCls}
                value={filters[s.key]}
                onChange={(e) => setFilters((f) => ({ ...f, [s.key]: e.target.value }))}
              >
                {s.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 액션 바 */}
      <div className="flex flex-col gap-3 border-t border-line bg-soft/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5 text-[15px] text-sub">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Icon name="car" size={18} />
          </span>
          현재 검색 가능 차량{' '}
          <strong key={count} className="text-lg font-extrabold text-primary tabular-nums">
            {count.toLocaleString()}대
          </strong>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            aria-pressed={saved}
            className={`flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border px-5 text-[15px] font-bold transition-colors sm:flex-none ${
              saved
                ? 'border-primary bg-primary-soft text-primary'
                : 'border-line bg-white text-ink hover:border-faint'
            }`}
          >
            <Icon name="bookmark" size={17} />
            {saved ? '저장됨' : '조건 저장'}
          </button>
          <button
            type="button"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(0,105,255,0.35)] transition-colors hover:bg-primary-dark sm:flex-none"
          >
            <Icon name="search" size={18} />
            실매물 검색
          </button>
        </div>
      </div>
    </div>
  )
}
