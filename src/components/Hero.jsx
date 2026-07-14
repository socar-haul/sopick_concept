import SearchPanel from './SearchPanel.jsx'
import { asset } from '../data.js'

export default function Hero() {
  return (
    <section className="relative">
      {/* 배경: 해안 도로 무드의 레이어드 그라디언트 */}
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#e3eefb_0%,#c9e0f6_34%,#a3c8ec_58%,#82abd8_71%,#3d4f68_72%,#2b394d_100%)]">
        {/* 태양 글로우 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-[12%] h-80 w-80 rounded-full bg-white/50 blur-3xl"
        />
        {/* 수평선 안개 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[56%] h-20 bg-gradient-to-b from-transparent via-white/25 to-transparent"
        />

        <div className="shell relative grid items-end gap-x-5 pt-8 pb-[50px] md:grid-cols-[1.6fr_1fr] md:pt-10 md:pb-[66px]">
          <div className="hero-rise relative z-10 pb-4 md:-top-5 md:self-center md:pb-12">
            <p className="mb-3.5 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-[13px] font-bold text-primary backdrop-blur">
              실매물 1,258대 · 5분 전 업데이트
            </p>
            <h1 className="text-[28px] leading-[1.25] font-extrabold tracking-[-0.02em] text-ink sm:text-[34px] lg:text-[40px] lg:whitespace-nowrap">
              원하는 차 pick하고, 내일 받으세요.
            </h1>
            <p className="mt-3 text-base font-medium text-[#3d4c63] sm:text-lg">
              1개월부터 60개월까지 실매물 기준으로 비교합니다
            </p>
          </div>

          {/* 도로 경계선 위에 차량이 서 있는 구도 */}
          <div className="hero-drive relative self-end md:justify-self-end">
            <img
              src={asset('cars/car789.png')}
              alt="테슬라 모델 Y"
              className="relative z-10 mx-auto -mt-16 -mb-6 w-[320px] drop-shadow-[0_30px_22px_rgba(10,20,34,0.45)] sm:w-[380px] md:-mt-[100px] md:-mb-8 lg:-mt-[120px] lg:w-[440px]"
            />
          </div>
        </div>
      </div>

      {/* 히어로 경계에 걸치는 검색 패널 */}
      <div className="shell relative z-20 -mt-16 pb-4 md:-mt-24">
        <SearchPanel />
      </div>
    </section>
  )
}
