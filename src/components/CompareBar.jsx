import { Icon } from '../icons.jsx'
import { carById, fmtFee } from '../data.js'

export default function CompareBar({ compareIds, onToggleCompare, onClear }) {
  if (compareIds.length === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="shell pb-4">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-navy p-3 pl-5 text-white shadow-[0_-8px_40px_rgba(16,24,40,0.3)] ring-1 ring-white/10">
          <p className="text-sm font-bold">
            비교함 <span className="text-primary-soft tabular-nums">{compareIds.length}</span>/3
          </p>

          <div className="flex flex-1 gap-2 overflow-x-auto no-scrollbar">
            {compareIds.map((id) => {
              const car = carById(id)
              return (
                <span key={id} className="flex shrink-0 items-center gap-2 rounded-xl bg-white/10 py-1.5 pr-2 pl-1.5 text-[13px] font-semibold">
                  <img src={car.img} alt="" className="h-8 w-11 object-contain" />
                  <span>
                    {car.model}
                    <span className="ml-1.5 text-white/60 tabular-nums">{fmtFee(car.fee24)}만</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleCompare(id)}
                    aria-label={`${car.model} 비교에서 제거`}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    <Icon name="close" size={11} />
                  </button>
                </span>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClear}
              className="h-11 rounded-xl px-4 text-sm font-bold text-white/70 transition-colors hover:text-white"
            >
              비우기
            </button>
            <button
              type="button"
              disabled={compareIds.length < 2}
              className="flex h-11 items-center gap-1.5 rounded-xl bg-primary px-6 text-sm font-bold transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              비교하기
              <Icon name="arrowRight" size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
