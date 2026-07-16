/* =========================================================
   쏘픽 SOPICK — application logic
   ========================================================= */

/* ---------- 견적 엔진 ---------- */
const TERM_ANCHORS = [[1,2.0],[3,1.70],[6,1.45],[12,1.22],[24,1.08],[36,1.0],[48,0.96],[60,0.92]];
function lerpAnchors(a,x){
  if(x<=a[0][0]) return a[0][1];
  for(let i=1;i<a.length;i++){ const[x0,y0]=a[i-1],[x1,y1]=a[i]; if(x<=x1){ return y0+(y1-y0)*((x-x0)/(x1-x0)); } }
  return a[a.length-1][1];
}
const termMult = t => lerpAnchors(TERM_ANCHORS, t);
const MILEAGE = { 1000:0.94, 1500:1.0, 2000:1.09, 3000:1.22 };
const mileageMult = km => MILEAGE[km] ?? 1;
const prepayDiscount = pct => pct * 0.6;                 // 10%p 선수금 → 월 6% 인하

function monthlyFee(car, term=36, km=1500, prepayPct=0){
  const f = car.baseFee * termMult(term) * mileageMult(km) * (1 - prepayDiscount(prepayPct));
  return Math.round(f/1000)*1000;
}
function buyout(car, term){
  const res = Math.max(0.30, 1 - term*0.0118);
  return Math.round(car.msrp*res/10000)*10000;
}

/* ---------- 포맷 ---------- */
const won = n => '₩' + Math.round(n).toLocaleString('ko-KR');
const man = n => (n/10000).toLocaleString('ko-KR');
function availBucket(d){ if(d<=0)return'즉시 출고'; if(d<=7)return'1주 이내'; if(d<=30)return'1개월 이내'; return'3개월 이내'; }
const TYPE_LABEL = { stock:'신차 스탁', order:'신차 주문', used:'중고차' };

/* =========================================================
   차량 이미지 (실매물 카탈로그 사진 · 투명 PNG)
   ========================================================= */
function imgTag(car){
  // 모든 차량 이미지는 큰 디테일 이미지(car***_detail.png) 사용, 없으면 썸네일로 폴백
  return `<img class="carimg" src="images/${car.detail || car.img}.png" alt="${car.brand} ${car.model}" loading="lazy" decoding="async">`;
}
const detailSrc = car => `images/${car.detail || car.img}.png`;
const fuelSuffixLabel = car => car.fuel==='전기' ? '전비' : '복합연비';
const rangeLabel = car => car.fuel==='전기' ? '1회 충전 주행거리' : '가득 주유 시 주행거리';
const rangeShort = car => car.range.replace(/^(가득|완충)\s*1회\s*/,'');

/* 옵션 사진 기본 세트(모델Y) — 아직 자체 옵션 사진이 없는 모델의 임시 폴백 */
const SAMPLE_OPTION_PHOTOS = ['Model-Y-Premium-Hero-Desktop-NA.avif','Model-Y-Meet-Entertainment-Desktop-NA-AU-NZ.avif','Model-Y-Meet-Entertainment-Sound-Desktop.avif','Model-Y-Meet-Convenience-Climate-Desktop.avif','Model-Y-Meet-Convenience-Keys-Desktop-NA.avif','Model-Y-L-Sleek-Carousel-Slide-1-Desktop.avif','Model-Y-Performance-Hero-Desktop-NA.avif'];

/* 캐러셀 이미지 목록 = 외관 디테일컷 + 옵션 사진(detail_modely/) */
function carGallery(car){
  const ext = (car.gallery || [car.detail || car.img]).map(n=>`images/${n}.png`);
  const opt = (car.optionPhotos || SAMPLE_OPTION_PHOTOS).map(n=>`detail_modely/${encodeURIComponent(n)}`);
  return ext.concat(opt);
}

/* 스펙 KPI 타일 (상세 모달용) */
function specTiles(car){
  const tiles = [
    { k: fuelSuffixLabel(car), v: car.economy },
    { k:'탑승 인원', v: car.seats + '인승' },
    { k: rangeLabel(car), v: rangeShort(car) },
    { k:'최고 출력', v: car.power },
  ];
  return tiles.map(t=>`<div class="spec-tile"><div class="v num">${t.v}</div><div class="k">${t.k}</div></div>`).join('');
}
function optionChips(car){
  return car.options.map(o=>`<span class="opt-chip">${o}</span>`).join('');
}

/* 히어로 카드 내 텍스트 스펙 — 트림·연료·주행·인승을 한 줄로 통합 표기 */
function stageSpecsHTML(car){
  const items = [ car.trim, car.fuel, rangeShort(car), `${car.seats}인승` ];
  return `<div class="stage__spec-line">${items.map(t=>`<span>${t}</span>`).join('<i class="sep">·</i>')}</div>`;
}

/* =========================================================
   상태
   ========================================================= */
const state = {
  budget: 800000,
  term: 60,
  type: 'ev',          // Phase1: 전기차(ev) / 내연차(ice) 2분류. 기본 전기차

  brand:'all', segment:'all', fuel:'all', avail:'all',
  sort:'recommend',
  extra:{ tags:[], avail:[] },
  cat:null,
  featuredId:'c06',   // 기본 추천차: 테슬라 모델 Y (사용자 조작 시 해제 → 예산 내 자동 추천)
};
const BUDGET_MIN=400000, BUDGET_MAX=2800000, BUDGET_STEP=50000;

const feeFor = car => monthlyFee(car, state.term, 1500, 0);

function matches(car){
  if(feeFor(car) > state.budget) return false;
  if(state.type==='ev'  && car.fuel!=='전기') return false;   // 전기차
  if(state.type==='ice' && car.fuel==='전기') return false;   // 내연차(가솔린·디젤·하이브리드)
  if(state.brand!=='all' && car.brand!==state.brand) return false;
  if(state.segment!=='all' && car.segment!==state.segment) return false;
  if(state.fuel!=='all' && car.fuel!==state.fuel) return false;
  if(state.avail!=='all' && availBucket(car.availDays)!==state.avail) return false;
  if(state.extra.tags.length && !state.extra.tags.some(t=>car.tags.includes(t))) return false;
  if(state.extra.avail.length && !state.extra.avail.includes(availBucket(car.availDays))) return false;
  return true;
}
function sortCars(list){
  const by = {
    recommend:(a,b)=> (b.tags.includes('24시간 배송')-a.tags.includes('24시간 배송')) || (feeFor(b)-feeFor(a)),
    priceAsc:(a,b)=> feeFor(a)-feeFor(b),
    priceDesc:(a,b)=> feeFor(b)-feeFor(a),
    avail:(a,b)=> a.availDays-b.availDays,
  }[state.sort];
  return [...list].sort(by);
}

/* =========================================================
   렌더링
   ========================================================= */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function setTrack(el){
  const pct = (el.value-el.min)/(el.max-el.min)*100;
  el.style.setProperty('--track', `linear-gradient(90deg, var(--accent) 0 ${pct}%, var(--surface-3) ${pct}% 100%)`);
}

/* ① 슬라이더 값이 점프할 때(칩·프리셋) 핸들·숫자가 부드럽게 이동 */
function animateRange(el, to, {ms=340, onStep, onDone}={}){
  const from = +el.value, diff = to - from;
  let done = false;
  const finish = ()=>{ if(done) return; done=true; el._raf=null; clearTimeout(el._to);
    el.value = to; setTrack(el); onStep&&onStep(+el.value); onDone&&onDone(); };  // 최종 위치 확정
  if(!diff){ finish(); return; }
  const t0 = performance.now();
  const ease = t => 1 - Math.pow(1-t, 3);   // easeOutCubic
  el._raf && cancelAnimationFrame(el._raf);
  clearTimeout(el._to); el._to = setTimeout(finish, ms + 120);  // rAF가 멈춰도 반드시 최종값 반영
  (function step(now){
    if(done) return;
    const p = Math.min(1, (now-t0)/ms);
    el.value = Math.round(from + diff*ease(p));
    setTrack(el);
    onStep && onStep(+el.value);
    if(p<1) el._raf = requestAnimationFrame(step);
    else finish();
  })(t0);
}

/* CSS 애니메이션 재생(같은 요소에 다시 트리거) */
function replayAnim(el, cls){ if(!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

/* ② 세그먼트 활성 항목 위치로 흰색 인디케이터 이동 */
function positionSegInd(){
  const seg = $('#typeSeg'); if(!seg) return;
  const ind = seg.querySelector('.type-tabs__ind');
  const active = seg.querySelector('button[aria-pressed=true]');
  if(!ind) return;
  if(!active || !active.offsetWidth){ ind.style.width='0px'; return; }  // 숨겨진 탭(모바일 '전체' 등)이면 인디케이터 숨김
  const sr = seg.getBoundingClientRect(), ar = active.getBoundingClientRect();
  const cs = getComputedStyle(seg);
  const bl = parseFloat(cs.borderLeftWidth)||0, bt = parseFloat(cs.borderTopWidth)||0;
  ind.style.width  = ar.width + 'px';
  ind.style.height = ar.height + 'px';
  ind.style.transform = `translate(${ar.left-sr.left-bl}px, ${ar.top-sr.top-bt}px)`;
}

function renderBudget(){
  $('#budgetAmt').textContent = man(state.budget);
  $$('#budgetChips .chip').forEach(c=> c.setAttribute('aria-pressed', (+c.dataset.v===state.budget)+''));
}
function renderTerm(){
  $('#termVal').innerHTML = `<b>${state.term}</b>개월`;
}
function renderCounts(){
  const within = t => CARS.filter(c=> monthlyFee(c,state.term)<=state.budget && (t==='ev'?c.fuel==='전기':c.fuel!=='전기')).length;
  $$('#typeSeg button').forEach(b=>{
    b.setAttribute('aria-pressed',(b.dataset.type===state.type)+'');
    b.querySelector('.cnt').textContent = within(b.dataset.type);
  });
  positionSegInd();
}
function renderStage(){
  const pool = sortCars(CARS.filter(matches));
  stagePool = pool;                                           // 좌/우 화살표(모델 전환)에서 참조
  const stage = $('#stage');
  if(!pool.length){
    stage.classList.add('is-empty');
    $('#stageName').textContent='조건에 맞는 차량 없음';
    $('#stagePrice').textContent='—';
    $('#stageSpecs').innerHTML='<div class="stage__spec-line"><span>예산이나 기간을 조정해 보세요</span></div>';
    $('#heroTrack').innerHTML=''; $('#stageThumbs').innerHTML=''; stage.dataset.id=''; return;
  }
  stage.classList.remove('is-empty');
  const autoTop = [...pool].sort((a,b)=>feeFor(b)-feeFor(a))[0]; // 예산 내 가장 프리미엄
  const top = (state.featuredId && pool.find(c=>c.id===state.featuredId))
           || (state.type==='ev' && pool.find(c=>c.id==='c06'))   // Phase1: 전기차 기본 노출 = 테슬라 모델 Y
           || autoTop;
  $('#stagePrice').textContent = won(feeFor(top));            // 요금은 기간 변동 시 항상 갱신
  $('#stageTermNote').textContent = state.term;               // "N개월 기준" 표기
  if(stage.dataset.id !== top.id){                            // 추천 차량이 바뀔 때만 카드 내용 재구성
    stage.dataset.id = top.id;
    $('#stageName').textContent = `${top.brand} ${top.model}`;
    $('#stageSpecs').innerHTML = stageSpecsHTML(top);
    renderCarousel(top);
    replayAnim(stage, 'is-modelchange');   // ③ 모델 변경 시 헤더 페이드업
  }
}

/* ── 히어로 카드: 차량 사진(모델 전환) + 옵션 썸네일(클릭 시 이미지 변경) ── */
let stagePool = [];              // 현재 추천 후보 목록 (좌/우 화살표로 순회)
let galleryImgs = [], imgIdx = 0;  // 현재 모델의 옵션 사진 세트 / 표시 중 인덱스
const STAGE_IMG_MAX = 6;         // 옵션 사진 디폴트 노출 개수

function renderCarousel(car){
  galleryImgs = carGallery(car).slice(0, STAGE_IMG_MAX);
  imgIdx = 0;
  $('#heroTrack').innerHTML =
    `<div class="stage__slide"><img class="carimg" id="stageMainImg" src="${galleryImgs[0]||''}" alt="${car.brand} ${car.model}"></div>`;
  $('#stageThumbs').innerHTML = galleryImgs.length > 1
    ? galleryImgs.map((src,i)=>`<button class="s-thumb" data-i="${i}" aria-current="${i===0}" aria-label="${i+1}번째 사진"><img src="${src}" alt="" loading="lazy"></button>`).join('')
    : '';
  $('#heroCarousel').classList.toggle('is-single', stagePool.length <= 1);  // 후보가 1대면 모델 전환 화살표 숨김
}

/* 옵션 썸네일 클릭 → 메인 사진만 크로스페이드로 교체 (④) */
function showImage(i){
  if(!galleryImgs.length) return;
  imgIdx = (i + galleryImgs.length) % galleryImgs.length;
  $$('#stageThumbs .s-thumb').forEach((t,idx)=> t.setAttribute('aria-current', (idx===imgIdx)+''));
  const img = $('#stageMainImg'); if(!img) return;
  const next = galleryImgs[imgIdx];
  img.classList.add('is-swapping');                 // 페이드 아웃
  setTimeout(()=>{                                   // 중간 지점에서 교체 후 페이드 인
    img.src = next;
    requestAnimationFrame(()=> img.classList.remove('is-swapping'));
  }, 180);
}

/* 좌/우 화살표 → 후보 목록에서 이전·다음 모델로 전환 */
function stageModel(dir){
  if(stagePool.length <= 1) return;
  const curId = $('#stage').dataset.id;
  let idx = stagePool.findIndex(c=>c.id===curId); if(idx<0) idx=0;
  idx = (idx + dir + stagePool.length) % stagePool.length;
  state.featuredId = stagePool[idx].id;   // 선택 모델 고정
  renderStage();
}
function specChips(car){
  const out=[car.segment, car.fuel, availBucket(car.availDays)];
  if(car.type==='used') out.push(`${car.year}년식 · ${(car.odo/10000).toFixed(1)}만km`);
  return out.map(s=>`<span class="spec">${s}</span>`).join('');
}
function tagChips(car){
  return car.tags.map(t=>{
    const cls = t==='친환경'?'is-ev': (t==='24시간 배송'?'is-hot': (t==='수입'?'is-import':''));
    return `<span class="tag ${cls}">${t}</span>`;
  }).join('');
}
function cardHTML(car){
  return `<article class="card" data-id="${car.id}" tabindex="0" role="button" aria-label="${car.brand} ${car.model} 상세보기">
    <div class="card__media">
      <div class="card__tags">${tagChips(car)}</div>
      <span class="type-pill">${TYPE_LABEL[car.type]}</span>
      ${car._img}
    </div>
    <div class="card__body">
      <div class="card__brand">${car.brand}</div>
      <div class="card__name">${car.model}</div>
      <div class="card__specs">${specChips(car)}</div>
      <div class="card__deposit">✓ 초기비용 0원 · 보험·정비·세금 포함</div>
      <div class="card__foot">
        <div class="card__price">
          <div class="k">월 대여료</div>
          <div class="v"><span class="p num">${won(feeFor(car))}</span><span class="u">/월</span></div>
        </div>
        <div class="card__go" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
    </div>
  </article>`;
}
function renderGrid(){
  const list = sortCars(CARS.filter(matches));
  $('#resultCount').textContent = list.length;
  const grid = $('#grid');
  if(!list.length){
    grid.innerHTML = `<div class="grid__empty"><b>조건에 맞는 실매물이 없어요</b>예산을 높이거나 필터를 초기화해 다시 찾아보세요.</div>`;
    return;
  }
  grid.innerHTML = list.map(cardHTML).join('');
}
function renderActiveSelects(){
  const map = { '#fBrand':'brand','#fSegment':'segment','#fFuel':'fuel','#fAvail':'avail' };
  Object.entries(map).forEach(([sel,key])=> $(sel).classList.toggle('is-active', state[key]!=='all'));
}
function renderAll(){ renderBudget(); renderTerm(); renderCounts(); renderStage(); renderGrid(); renderActiveSelects(); }

/* =========================================================
   필터 옵션 채우기
   ========================================================= */
function fillSelects(){
  const uniq = k => [...new Set(CARS.map(c=>c[k]))];
  const opt = (v,l)=>`<option value="${v}">${l}</option>`;
  const SEG_ORDER=['경형','소형','준중형','중형','준대형','대형','SUV','스포츠'];
  const brands = uniq('brand').sort((a,b)=>a.localeCompare(b,'ko'));
  const segs = uniq('segment').sort((a,b)=>SEG_ORDER.indexOf(a)-SEG_ORDER.indexOf(b));
  const fuels = ['가솔린','디젤','하이브리드','전기'].filter(f=>uniq('fuel').includes(f));
  const avails = ['즉시 출고','1주 이내','1개월 이내','3개월 이내'];
  $('#fBrand').innerHTML = opt('all','브랜드 전체')+brands.map(b=>opt(b,b)).join('');
  $('#fSegment').innerHTML = opt('all','차급 전체')+segs.map(s=>opt(s,s)).join('');
  $('#fFuel').innerHTML = opt('all','연료 전체')+fuels.map(f=>opt(f,f)).join('');
  $('#fAvail').innerHTML = opt('all','출고 전체')+avails.map(a=>opt(a,a)).join('');
}

/* =========================================================
   카테고리 · 스페셜
   ========================================================= */
const CAT_ICONS = {
  bolt:'M7 2 3 9h4l-1 5 6-8H8l1-4Z', star:'M8 1l2 4.5 5 .5-3.7 3.4 1 5L8 11.8 3.7 14.4l1-5L1 6l5-.5L8 1Z',
  wallet:'M2 4.5h11a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.5Zm9 3.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
  plug:'M5 2v4M11 2v4M4 6h8v2a4 4 0 0 1-8 0V6ZM8 12v3', crown:'M2 5l3 3 3-5 3 5 3-3v7H2V5Z',
  family:'M5 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM2 14v-2a3 3 0 0 1 3-3M14 14v-2a3 3 0 0 0-3-3',
};
function ic(name,size=18){ return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none"><path d="${CAT_ICONS[name]}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }

function renderCategories(){
  $('#catGrid').innerHTML = CATEGORIES.map(c=>`
    <button class="cat" data-cat="${c.key}">
      <div class="cat__ic">${ic(c.icon,20)}</div>
      <h3>${c.label}</h3>
      <p>${c.desc}</p>
      <span class="cat__go">차량 보기 <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    </button>`).join('');
}
function applyCategory(key){
  const cat = CATEGORIES.find(c=>c.key===key); if(!cat) return;
  Object.assign(state,{ type:'all', brand:'all', segment:'all', fuel:'all', avail:'all', extra:{tags:[],avail:[]}, cat:key, featuredId:null });
  const f=cat.filter;
  if(f.fuel) state.fuel=f.fuel;
  if(f.segment) state.segment=f.segment;
  if(f.maxTerm) state.term=Math.min(state.term,3);
  if(f.tags) state.extra.tags=f.tags;
  if(f.avail) state.extra.avail=f.avail;
  if(f.zeroDeposit){ state.sort='priceAsc'; }
  syncControls(); renderAll();
  $('#explore').scrollIntoView({behavior:'smooth', block:'start'});
}
function syncControls(){
  $('#termRange').value=state.term; setTrack($('#termRange'));
  $('#fBrand').value=state.brand; $('#fSegment').value=state.segment; $('#fFuel').value=state.fuel; $('#fAvail').value=state.avail; $('#fSort').value=state.sort;
}

function renderSpecials(){
  const picks = ['c06','c03','c05','c09','c07','c20','c33'].map(id=>CARS.find(c=>c.id===id)).filter(Boolean);
  $('#spGrid').innerHTML = picks.map((car,i)=>{
    const fee = monthlyFee(car,36);
    const old = Math.round(fee*1.18/1000)*1000;
    const off = Math.round((1-fee/old)*100);
    return `<article class="sp-card" data-id="${car.id}">
      <div class="sp-card__media"><span class="sp-badge">-${off}%</span>${car._img}</div>
      <div class="sp-card__body">
        <div class="card__brand" style="font-family:var(--mono);color:var(--muted);font-size:12px;font-weight:600">${car.brand}</div>
        <div class="sp-card__name">${car.model}</div>
        <div class="sp-card__row">
          <div><div style="font-size:11px;color:var(--muted-2)">이달의 스페셜</div><span class="sp-old num">${won(old)}</span></div>
          <div style="text-align:right"><span class="sp-new num">${won(fee)}<span class="u">/월</span></span></div>
        </div>
      </div>
    </article>`;
  }).join('');
}

/* =========================================================
   상세 모달 + 견적
   ========================================================= */
let mdState=null;
const MODAL = $('#modal');

function openModal(car){
  mdState = { car, term:Math.min(60,Math.max(1,state.term)), km:1500, prepay:0 };
  renderModal();
  MODAL.classList.add('is-open');
  document.body.style.overflow='hidden';
  MODAL.querySelector('.modal__close').focus();
}
function closeModal(){ MODAL.classList.remove('is-open'); document.body.style.overflow=''; mdState=null; }

function optRow(label, current, opts, key){
  return opts.map(o=>`<button data-mdopt="${key}" data-val="${o.v}" aria-pressed="${o.v===current}">${o.t}${o.s?`<small>${o.s}</small>`:''}</button>`).join('');
}
function renderModal(){
  const {car,term,km,prepay}=mdState;
  const fee = monthlyFee(car,term,km,prepay);
  const base = monthlyFee(car,36,1500,0);
  const diff = base-fee;
  const initial = Math.round(car.msrp*prepay/10000)*10000;
  const buy = buyout(car,term);
  const subHtml = diff>0
    ? `기준(36개월·1,500km·선수금0) 대비 월 <b>${won(diff)}</b> 절약`
    : diff<0 ? `기준 조건보다 월 ${won(-diff)} 높음` : `가장 많이 선택하는 기준 조건`;

  MODAL.querySelector('#mdContent').innerHTML = `
    <div class="md-hero">
      <div class="md-hero__top">${tagChips(car)}<span class="type-pill" style="position:static;margin-left:auto">${TYPE_LABEL[car.type]}</span></div>
      <div class="md-hero__car"><img class="carimg" src="${detailSrc(car)}" alt="${car.brand} ${car.model}"></div>
      <div class="md-hero__name">${car.brand}</div>
      <h2>${car.model}</h2>
      <div class="md-hero__trim">${car.trim}${car.type==='used'?` · ${car.year}년식 · 주행 ${car.odo.toLocaleString('ko-KR')}km`:''}</div>
    </div>
    <div class="md-body">
      <div class="md-price">
        <div class="md-price__lab">월 대여료 (보험·정비·자동차세 포함)</div>
        <div class="md-price__main"><span class="p num" id="mdFee">${won(fee)}</span><span class="u">/월</span></div>
        <div class="md-price__sub" id="mdSub">${subHtml}</div>
      </div>

      <div class="md-carspec">
        <div class="md-spec-row">${specTiles(car)}</div>
        <div class="md-options"><div class="md-options__h">세부 옵션</div><div class="opts-grid">${optionChips(car)}</div></div>
      </div>

      <div class="md-config">
        <div class="md-config__block">
          <div class="md-config__lab"><span class="l">계약 기간</span><span class="v num" id="mdTermV">${term}개월</span></div>
          <div class="range"><input type="range" class="sl" id="mdTerm" min="1" max="60" step="1" value="${term}"></div>
          <div class="range__ticks"><span>1</span><span>12</span><span>24</span><span>36</span><span>48</span><span>60개월</span></div>
        </div>
        <div class="md-config__block">
          <div class="md-config__lab"><span class="l">월 주행거리</span><span class="v num">${km.toLocaleString('ko-KR')}km</span></div>
          <div class="opts">${optRow('',km,[{v:1000,t:'1,000km'},{v:1500,t:'1,500km'},{v:2000,t:'2,000km'},{v:3000,t:'3,000km'}],'km')}</div>
        </div>
        <div class="md-config__block">
          <div class="md-config__lab"><span class="l">초기 비용 (선수금)</span><span class="v num">${prepay===0?'0원':(prepay*100)+'%'}</span></div>
          <div class="opts">${optRow('',prepay,[{v:0,t:'0원',s:'추천'},{v:0.1,t:'10%'},{v:0.2,t:'20%'},{v:0.3,t:'30%'}],'prepay')}</div>
        </div>
      </div>

      <div class="md-specs">
        <div class="md-specs__row"><span class="k">월 대여료</span><span class="v" id="mdFee2">${won(fee)}</span></div>
        <div class="md-specs__row"><span class="k">초기 비용</span><span class="v" id="mdInit">${initial===0?'0원':won(initial)}</span></div>
        <div class="md-specs__row"><span class="k">계약 기간</span><span class="v" id="mdTerm2">${term}개월</span></div>
        <div class="md-specs__row"><span class="k">월 주행거리</span><span class="v" id="mdKm2">${km.toLocaleString('ko-KR')}km</span></div>
        <div class="md-specs__row"><span class="k">출고 가능일</span><span class="v sans">${car.availDays<=0?'즉시':availBucket(car.availDays)}</span></div>
        <div class="md-specs__row"><span class="k">보험 · 정비 · 세금</span><span class="v sans"><span class="incl">✓ 월 요금 포함</span></span></div>
      </div>

      <div class="md-secondary">
        <h4>${ic('crown',15)} 만기 후, 자유롭게 선택하세요</h4>
        <div class="md-secondary__grid">
          <div><div class="k">그대로 인수 시</div><div class="v num" id="mdBuy">${won(buy)}</div></div>
          <div><div class="k">다른 쏘픽카로 변경</div><div class="v" style="font-size:15px">위약금 0원</div></div>
        </div>
        <p>타던 차가 마음에 들면 예상가로 인수하고, 새 차가 끌리면 남은 계약 <b style="color:var(--save)">차액만 정산</b>해 다른 쏘픽카로 갈아탈 수 있어요. 신차 정가 ${won(car.msrp)}.</p>
      </div>

      <div class="md-cta">
        <button class="ghost">상담 신청</button>
        <button class="primary" id="mdCta">${Math.round(fee/10000)}만원에 구독하기</button>
      </div>
    </div>`;

  const mt = MODAL.querySelector('#mdTerm'); setTrack(mt);
}
function recalcModal(){
  const {car,term,km,prepay}=mdState;
  const fee=monthlyFee(car,term,km,prepay);
  const base=monthlyFee(car,36,1500,0);
  const diff=base-fee;
  const initial=Math.round(car.msrp*prepay/10000)*10000;
  const buy=buyout(car,term);
  MODAL.querySelector('#mdFee').textContent=won(fee);
  MODAL.querySelector('#mdFee2').textContent=won(fee);
  MODAL.querySelector('#mdCta').textContent=Math.round(fee/10000)+'만원에 구독하기';
  MODAL.querySelector('#mdInit').textContent=initial===0?'0원':won(initial);
  MODAL.querySelector('#mdTerm2').textContent=term+'개월';
  MODAL.querySelector('#mdKm2').textContent=km.toLocaleString('ko-KR')+'km';
  MODAL.querySelector('#mdTermV').textContent=term+'개월';
  MODAL.querySelector('#mdBuy').textContent=won(buy);
  MODAL.querySelector('#mdSub').innerHTML = diff>0
    ? `기준(36개월·1,500km·선수금0) 대비 월 <b>${won(diff)}</b> 절약`
    : diff<0 ? `기준 조건보다 월 ${won(-diff)} 높음` : `가장 많이 선택하는 기준 조건`;
  // update labels
  MODAL.querySelectorAll('.md-config__lab .v').forEach(()=>{});
  MODAL.querySelector('.md-config__block:nth-child(2) .md-config__lab .v').textContent = km.toLocaleString('ko-KR')+'km';
  MODAL.querySelector('.md-config__block:nth-child(3) .md-config__lab .v').textContent = prepay===0?'0원':(prepay*100)+'%';
}

/* =========================================================
   이벤트 바인딩
   ========================================================= */
function clearCat(){ state.cat=null; state.extra={tags:[],avail:[]}; state.featuredId=null; }

function bind(){
  // budget
  const br=$('#budgetRange');
  br.min=BUDGET_MIN; br.max=BUDGET_MAX; br.step=BUDGET_STEP; br.value=state.budget; setTrack(br);
  br.addEventListener('input',()=>{ state.budget=+br.value; setTrack(br); clearCat(); syncControls(); renderAll(); });
  $('#budgetChips').addEventListener('click',e=>{ const c=e.target.closest('.chip'); if(!c)return;
    const to=+c.dataset.v; clearCat();
    $$('#budgetChips .chip').forEach(x=>x.setAttribute('aria-pressed',(x===c)+''));      // 눌림 즉시 반영
    animateRange(br, to, { onStep:v=> $('#budgetAmt').textContent=man(v),
      onDone:()=>{ state.budget=to; renderAll(); } });
  });

  // term
  const tr=$('#termRange'); tr.value=state.term; setTrack(tr);
  tr.addEventListener('input',()=>{ state.term=+tr.value; state.featuredId=null; setTrack(tr); renderAll(); });

  // type segmented
  $('#typeSeg').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b)return; state.type=b.dataset.type; clearCat(); renderAll(); });

  // selects
  [['#fBrand','brand'],['#fSegment','segment'],['#fFuel','fuel'],['#fAvail','avail'],['#fSort','sort']].forEach(([sel,key])=>{
    $(sel).addEventListener('change',e=>{ state[key]=e.target.value; if(key!=='sort') clearCat(); renderAll(); });
  });

  // reset
  $('#btnReset').addEventListener('click',()=>{
    Object.assign(state,{budget:800000,term:60,type:'all',brand:'all',segment:'all',fuel:'all',avail:'all',sort:'recommend',extra:{tags:[],avail:[]},cat:null,featuredId:'c06'});
    br.value=state.budget; setTrack(br); syncControls(); renderAll();
  });

  // category
  $('#catGrid').addEventListener('click',e=>{ const c=e.target.closest('.cat'); if(c) applyCategory(c.dataset.cat); });

  // cards + specials → modal (히어로 사진 클릭은 #heroCarousel 핸들러에서 처리)
  document.addEventListener('click',e=>{
    const card=e.target.closest('.card,.sp-card'); if(card){ const car=CARS.find(c=>c.id===card.dataset.id); if(car) openModal(car); }
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Enter' && e.target.classList.contains('card')){ const car=CARS.find(c=>c.id===e.target.dataset.id); if(car) openModal(car); }
    if(e.key==='Escape' && MODAL.classList.contains('is-open')) closeModal();
  });

  // modal controls
  MODAL.querySelector('.modal__close').addEventListener('click',closeModal);
  MODAL.querySelector('.modal__scrim').addEventListener('click',closeModal);
  MODAL.addEventListener('input',e=>{ if(e.target.id==='mdTerm'){ mdState.term=+e.target.value; setTrack(e.target); recalcModal(); } });
  MODAL.addEventListener('click',e=>{
    const o=e.target.closest('[data-mdopt]'); if(!o)return;
    const key=o.dataset.mdopt, val=parseFloat(o.dataset.val);
    mdState[key]=val;
    o.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',(b===o)+''));
    recalcModal();
  });

  // 히어로 카드: 화살표=모델 전환 / 사진 클릭=상세 / 썸네일 클릭=이미지 변경
  $('#heroCarousel').addEventListener('click',e=>{
    if(e.target.closest('.stage__nav.prev')) return stageModel(-1);
    if(e.target.closest('.stage__nav.next')) return stageModel(1);
    const car = CARS.find(c=>c.id===$('#stage').dataset.id); if(car) openModal(car);   // 사진 클릭 → 상세
  });
  $('#stageThumbs').addEventListener('click',e=>{ const t=e.target.closest('.s-thumb'); if(t) showImage(+t.dataset.i); });

  // nav quote quick-scroll
  { const ne=$('#navExplore'); if(ne) ne.addEventListener('click',e=>{ e.preventDefault(); $('#explore').scrollIntoView({behavior:'smooth'}); }); }

  // 세그먼트 인디케이터: 리사이즈·폰트 로드 후 위치 재보정
  let segRaf; window.addEventListener('resize',()=>{ cancelAnimationFrame(segRaf); segRaf=requestAnimationFrame(positionSegInd); });
  window.addEventListener('load', positionSegInd);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(positionSegInd);
}

/* ---------- init ---------- */
CARS.forEach(c=> c._img = imgTag(c));   // 차량 이미지 태그 1회 사전 생성
fillSelects();
renderCategories();
renderSpecials();
bind();
syncControls();
renderAll();
