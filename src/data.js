/* SOPICK 마켓플레이스 — 실매물 샘플 데이터
 * fee24: 24개월 계약 기준 월 요금(원) · 보험/정비/세금 포함, 월 주행거리 무제한
 */

/* public/ 에셋 경로에 배포 base(예: /sopick_concept/concept1/)를 붙임 */
export const asset = (p) => import.meta.env.BASE_URL + p.replace(/^\//, '')

export const TYPE_META = {
  stock: { label: '24시간 배송', chip: 'bg-mint text-white', sub: '즉시 출고', subChip: 'bg-mint-soft text-mint' },
  order: { label: '신차 주문', chip: 'bg-primary text-white', sub: null, subChip: 'bg-primary-soft text-primary' },
  used: { label: '중고차', chip: 'bg-violet text-white', sub: '검수 완료', subChip: 'bg-violet-soft text-violet' },
}

/* 계약 기간별 월 요금 계수 (24개월 = 1.0) */
export const TERM_FACTOR = { 12: 1.16, 24: 1.0, 36: 0.92, 60: 0.85 }

export const CARS = [
  {
    id: 'ray', brand: '기아', model: '레이', trim: '1.0 가솔린 시그니처',
    type: 'stock', lead: '즉시 출고', fuel: '가솔린', segment: '경차', seats: 4,
    fee24: 440000, img: asset('cars/car354.png'), detailImg: asset('cars/car354_detail1.png'), tags: ['인기'],
  },
  {
    id: 'mini', brand: 'MINI', model: '쿠퍼 5도어', trim: '쿠퍼 S 클래식',
    type: 'order', lead: '주문 후 5-7주', fuel: '가솔린', segment: '소형', seats: 5,
    fee24: 590000, img: asset('cars/car808.png'), detailImg: asset('cars/car808_detail1.png'), tags: ['수입'],
  },
  {
    id: 'sportage', brand: '기아', model: '스포티지', trim: '1.6T 노블레스',
    type: 'stock', lead: '즉시 출고', fuel: '가솔린', segment: 'SUV', seats: 5,
    fee24: 720000, img: asset('cars/car689.png'), detailImg: asset('cars/car689_detail1.png'), tags: ['인기'],
  },
  {
    id: 'ioniq5', brand: '현대', model: '아이오닉 5', trim: '롱레인지 프레스티지',
    type: 'stock', lead: '출고 D+3', fuel: '전기', segment: 'SUV', seats: 5,
    fee24: 880000, img: asset('cars/car812.png'), detailImg: asset('cars/car812_detail1.png'), tags: ['친환경'],
  },
  {
    id: 'gv80', brand: '제네시스', model: 'GV80', trim: '3.0 디젤 AWD',
    type: 'used', lead: '검수 A등급', fuel: '디젤', segment: 'SUV', seats: 5,
    year: 2021, odo: '4.1만km',
    fee24: 980000, img: asset('cars/car518.png'), detailImg: asset('cars/car518_detail.png'), tags: ['프리미엄'],
  },
  {
    id: 'modely', brand: '테슬라', model: '모델 Y', trim: '롱레인지 AWD',
    type: 'order', lead: '주문 후 4-6주', fuel: '전기', segment: 'SUV', seats: 5,
    fee24: 1120000, img: asset('cars/car789.png'), detailImg: asset('cars/car789_detail1.png'), tags: ['인기', '친환경'],
  },
  {
    id: 'xc60', brand: '볼보', model: 'XC60', trim: 'B5 얼티메이트',
    type: 'stock', lead: '즉시 출고', fuel: '하이브리드', segment: 'SUV', seats: 5,
    fee24: 1290000, img: asset('cars/car775.png'), detailImg: asset('cars/car775_detail1.png'), tags: ['수입'],
  },
  {
    id: 'ix', brand: 'BMW', model: 'iX', trim: 'xDrive40',
    type: 'order', lead: '주문 후 6-8주', fuel: '전기', segment: 'SUV', seats: 5,
    fee24: 1390000, img: asset('cars/car767.png'), detailImg: asset('cars/car767_detail1.png'), tags: ['수입', '친환경'],
  },
]

export const BUDGETS = [
  { key: 'b60', label: '60만원 이하', min: 0, max: 600000 },
  { key: 'b90', label: '60-90만원', min: 600000, max: 900000 },
  { key: 'b120', label: '90-120만원', min: 900000, max: 1200000, hot: true },
  { key: 'bmax', label: '120만원 이상', min: 1200000, max: Infinity },
]

/* 인기 카테고리 칩 → 피처드 카드 구성 */
export const CATEGORY_FEATURES = [
  {
    key: 'ev', label: '전기차', icon: 'bolt',
    eyebrow: '전기차', title: '전기 SUV', carId: 'modely',
    name: 'Tesla 모델 Y', meta: '2024 · 롱레인지 · AWD',
  },
  {
    key: 'suv', label: 'SUV', icon: 'suv',
    eyebrow: 'SUV', title: '패밀리 SUV', carId: 'sportage',
    name: '기아 스포티지', meta: '2024 · 1.6T · 노블레스',
  },
  {
    key: 'hybrid', label: '하이브리드', icon: 'leaf',
    eyebrow: '하이브리드', title: '프리미엄 하이브리드', carId: 'xc60',
    name: '볼보 XC60', meta: '2024 · B5 · 얼티메이트',
  },
  {
    key: 'import', label: '수입차', icon: 'globe',
    eyebrow: '수입차', title: '플래그십 전기 SUV', carId: 'ix',
    name: 'BMW iX', meta: '2024 · xDrive40',
  },
  {
    key: 'instant', label: '즉시 출고', icon: 'clock',
    eyebrow: '즉시 출고', title: '3일 안에 받는 전기차', carId: 'ioniq5',
    name: '현대 아이오닉 5', meta: '2024 · 롱레인지 · 프레스티지',
  },
  {
    key: 'under100', label: '100만원 이하', icon: 'won',
    eyebrow: '100만원 이하', title: '엔트리 시티카', carId: 'ray',
    name: '기아 레이', meta: '2024 · 1.0 · 시그니처',
  },
  {
    key: 'biz', label: '법인 추천', icon: 'briefcase',
    eyebrow: '법인 추천', title: '비즈니스 SUV', carId: 'gv80',
    name: '제네시스 GV80', meta: '2021 · 3.0D · 검수 A등급',
  },
]

export const QUICK_LINKS = [
  { icon: 'sedan', label: '세단', count: 42 },
  { icon: 'leaf', label: '하이브리드', count: 38 },
  { icon: 'clock', label: '즉시출고', count: 27 },
  { icon: 'won', label: '100만원 이하', count: 51 },
]

/* 검색 패널 탭별 기본 재고 수 (합계 1,258대) */
export const TAB_STOCK = {
  stock: { label: '24시간 배송', count: 248 },
  order: { label: '신차 주문', count: 512 },
  used: { label: '중고차', count: 498 },
}

export const TERM_RANGES = [
  { key: 'all', label: '전체', share: 1 },
  { key: 't1', label: '1-12개월', share: 0.34 },
  { key: 't2', label: '13-36개월', share: 0.66 },
  { key: 't3', label: '37-60개월', share: 0.27 },
]

export const fmtWon = (n) => `${Math.round(n / 10000)}만원`
export const fmtFee = (fee24, term = 24) => Math.round((fee24 * TERM_FACTOR[term]) / 10000)
export const carById = (id) => CARS.find((c) => c.id === id)
