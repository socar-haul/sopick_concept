/* =========================================================
   쏘픽 SOPICK — 마이페이지 인터랙션
   스마트키(문열기·잠그기·경적·비상등·위치보기) · 셀프 서비스
   ========================================================= */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ── 토스트 ── */
let toastTimer;
function toast(msg){
  const t=$('#mpToast'); $('#mpToastText').textContent=msg;
  t.classList.add('show'); clearTimeout(toastTimer);
  toastTimer=setTimeout(()=> t.classList.remove('show'), 2200);
}

/* ── 스마트키 ── */
const LOCK_SVG   = `<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.6" stroke="currentColor" stroke-width="1.5"/><path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.5"/></svg>`;
const UNLOCK_SVG = `<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.6" stroke="currentColor" stroke-width="1.5"/><path d="M5 7V5a3 3 0 0 1 5.7-1.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
const keyState = { locked:true, hazard:false };

function renderKeyStatus(){
  const chip=$('#mpLockChip');
  chip.classList.toggle('is-locked', keyState.locked);
  chip.classList.remove('is-open');
  $('#mpLockText').textContent = keyState.locked ? '주차됨 · 잠김' : '주차됨 · 잠금 해제';
  $('#mpLockIc').innerHTML = keyState.locked ? LOCK_SVG : UNLOCK_SVG;
}
function flashKey(btn){ btn.classList.add('is-flash'); setTimeout(()=>btn.classList.remove('is-flash'), 320); }

$('#mpKeys').addEventListener('click', e=>{
  const b=e.target.closest('.mp-key'); if(!b) return;
  const k=b.dataset.key;
  if(k!=='hazard') flashKey(b);
  if(k==='unlock'){ keyState.locked=false; renderKeyStatus(); toast('차량 문을 열었어요'); }
  else if(k==='lock'){ keyState.locked=true; renderKeyStatus(); toast('차량을 잠갔어요'); }
  else if(k==='horn'){ toast('경적을 울렸어요 · 빵!'); }
  else if(k==='hazard'){ keyState.hazard=!keyState.hazard; b.classList.toggle('is-hazard-on', keyState.hazard); toast(keyState.hazard?'비상등을 켰어요':'비상등을 껐어요'); }
  else if(k==='locate'){ toast('차량 위치를 지도에서 확인할게요'); }
});
renderKeyStatus();

/* 셀프 서비스 카드 (앵커 제외) */
$('#mpGrid').addEventListener('click', e=>{
  const card=e.target.closest('.mp-card[data-svc]'); if(!card) return;
  const name=card.dataset.svc;
  if(card.dataset.urgent) toast(`긴급출동 접수 — 1588-0000으로 연결할게요`);
  else toast(`${name} — 담당 화면으로 이동할게요`);
});

/* =========================================================
   모델 변경 비교 모달
   ========================================================= */
/* 견적 엔진 (app.js와 동일 로직) */
const TERM_ANCHORS=[[1,2.0],[3,1.70],[6,1.45],[12,1.22],[24,1.08],[36,1.0],[48,0.96],[60,0.92]];
function lerpAnchors(a,x){ if(x<=a[0][0])return a[0][1]; for(let i=1;i<a.length;i++){const[x0,y0]=a[i-1],[x1,y1]=a[i]; if(x<=x1)return y0+(y1-y0)*((x-x0)/(x1-x0));} return a[a.length-1][1]; }
const termMult=t=>lerpAnchors(TERM_ANCHORS,t);
const MILEAGE={1000:0.94,1500:1.0,2000:1.09,3000:1.22};
const monthlyFee=(car,term=36,km=1500)=>Math.round(car.baseFee*termMult(term)*(MILEAGE[km]??1)/1000)*1000;
const man=n=>Math.round(n/10000).toLocaleString('ko-KR');

const MPC={
  curId:'c06',
  candidates:['c09','c07','c14','c03','c04','c16'],   // GV80 · 팰리세이드 · iX · 아이오닉5 · 그랜저 · 모델3
  selected:'c09',
  PROMO:0.12,
  SAMPLE:['Model-Y-Premium-Hero-Desktop-NA.avif','Model-Y-Meet-Entertainment-Desktop-NA-AU-NZ.avif','Model-Y-Meet-Entertainment-Sound-Desktop.avif','Model-Y-Meet-Convenience-Climate-Desktop.avif','Model-Y-Performance-Hero-Desktop-NA.avif']
};
const carById = id => (typeof CARS!=='undefined') ? CARS.find(c=>c.id===id) : null;
const exImg  = car => `images/${car.detail||car.img}.png`;
const optThumbs = car => (car.optionPhotos||MPC.SAMPLE).slice(0,3).map(n=>`detail_modely/${encodeURIComponent(n)}`);
const yearOf = car => car.year ? `${car.year}년식` : '2026년형';
const ecoLabel = car => car.fuel==='전기' ? '전비' : '복합연비';
const kmOf = s => { const m=String(s).replace(/,/g,'').match(/(\d+)\s*km/); return m?+m[1]:0; };   // "가득 1회 700km" → 700
const hpOf = s => { const m=String(s).replace(/,/g,'').match(/(\d+)\s*마력/); return m?+m[1]:0; };

function betterPoints(nw, cur){
  const pts=[];
  if(nw.seats>cur.seats) pts.push(`탑승 인원 ${cur.seats} → ${nw.seats}인승`);
  const nr=kmOf(nw.range), cr=kmOf(cur.range);
  if(nr>cr) pts.push(`1회 주행거리 ${cr.toLocaleString('ko-KR')} → ${nr.toLocaleString('ko-KR')}km`);
  const np=hpOf(nw.power), cp=hpOf(cur.power);
  if(np>cp) pts.push(`최고 출력 ${cp} → ${np}마력`);
  if(nw.tags.includes('프리미엄') && !cur.tags.includes('프리미엄')) pts.push('프리미엄 라인업으로 업그레이드');
  if(nw.tags.includes('수입') && !cur.tags.includes('수입')) pts.push('수입 브랜드 모델로 변경');
  if(pts.length<2) pts.push('새 차량 컨디션으로 완전히 새 기분');
  if(pts.length<2) pts.push('보험·정비·세금 포함은 그대로 유지');
  return pts.slice(0,3);
}
function deliveryText(car){
  const days = car.availDays>0 ? car.availDays : 1;
  const d=new Date(); d.setDate(d.getDate()+days);
  return `${d.getMonth()+1}월 ${d.getDate()}일 (${'일월화수목금토'[d.getDay()]})`;
}
function vhHTML(car, isNew, nameHTML){
  const fee=monthlyFee(car,60,1500);
  const shown=isNew?Math.round(fee*(1-MPC.PROMO)/1000)*1000:fee;
  const price=isNew?`월 ${man(shown)}만원<span class="o">월 ${man(fee)}만원</span>`:`월 ${man(shown)}만원`;
  const name=nameHTML||`<div class="mpc-vh__name">${car.brand} ${car.model}</div>`;
  return `<div class="mpc-vh ${isNew?'new':'cur'}">
    <div class="mpc-vh__tag">${isNew?'변경할 모델':'현재 구독 중'}</div>
    <div class="mpc-vh__namerow">${name}</div>
    <div class="mpc-vh__img"><img src="${exImg(car)}" alt="${car.brand} ${car.model}"></div>
    <div class="mpc-vh__price">${price}</div>
  </div>`;
}
const cmpRow = (label,cur,nw) => `<span class="l">${label}</span><span class="v">${cur}</span><span class="l">${label}</span><span class="v">${nw}</span>`;

function renderCompare(){
  const cur=carById(MPC.curId), nw=carById(MPC.selected);
  if(!cur||!nw) return;
  const curFee=monthlyFee(cur,60,1500);
  const base=monthlyFee(nw,60,1500), newFee=Math.round(base*(1-MPC.PROMO)/1000)*1000;
  const delta=newFee-curFee;
  const deltaTxt = delta===0?'변동 없음':(delta>0?`+${man(delta)}만원`:`−${man(-delta)}만원`);

  // 변경할 모델 = 콤보박스(모델명 영역에 통합, 사진 위)
  const selectHTML = `<div class="mpc-select-wrap mpc-vh__select"><select class="mpc-select" id="mpcSelect" aria-label="변경할 모델 선택">${
      MPC.candidates.map(id=>{ const c=carById(id); if(!c)return''; const f=monthlyFee(c,60,1500); const d=Math.round(f*(1-MPC.PROMO)/1000)*1000;
        return `<option value="${id}" ${id===MPC.selected?'selected':''}>${c.brand} ${c.model} · 월 ${man(d)}만원</option>`;
      }).join('')}</select></div>`;
  $('#mpcVehicles').innerHTML = `${vhHTML(cur,false)}${vhHTML(nw,true,selectHTML)}`;   // 5:5, 스페이서 제거

  // "월 N만원만 더 내면 변경 가능" 강조 메시지
  const upsellMsg = delta>0
    ? `월 <b>${man(delta)}만원</b>만 더 내면 ${nw.model}(으)로 바꿀 수 있어요`
    : delta<0
      ? `지금보다 월 <b>${man(-delta)}만원</b> 저렴하게 ${nw.model}(으)로 바꿀 수 있어요`
      : `추가 요금 없이 ${nw.model}(으)로 바꿀 수 있어요`;

  $('#mpcBody').innerHTML = `
    <div class="mpc-upsell"><span class="ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 8h11l-2.5-3M20 16H9l2.5 3" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="msg">${upsellMsg}</span></div>
    <div class="mpc-better"><div class="h">${nw.model}, 지금 모델보다 이런 점이 좋아요</div>
      <ul>${betterPoints(nw,cur).map(p=>`<li>${p}</li>`).join('')}</ul></div>
    <section class="mpc-sec"><div class="mpc-sec__t">성능 · 제원</div>
      <div class="mpc-cmp">
        ${cmpRow('연식', yearOf(cur), yearOf(nw))}
        ${cmpRow('연료', cur.fuel, nw.fuel)}
        ${cmpRow('공인 연비', `${ecoLabel(cur)} ${cur.economy}`, `${ecoLabel(nw)} ${nw.economy}`)}
        ${cmpRow('주행거리', `${kmOf(cur.range).toLocaleString('ko-KR')}km`, `${kmOf(nw.range).toLocaleString('ko-KR')}km`)}
        ${cmpRow('최고 출력', `${hpOf(cur.power)}마력`, `${hpOf(nw.power)}마력`)}
        ${cmpRow('탑승 인원', `${cur.seats}인승`, `${nw.seats}인승`)}
        ${cmpRow('차급', cur.segment, nw.segment)}
        ${cmpRow('신차가', `${man(cur.msrp)}만원`, `${man(nw.msrp)}만원`)}
      </div>
    </section>
    <section class="mpc-sec"><div class="mpc-sec__t">주요 옵션</div>
      <div class="mpc-cmp">
        ${cmpRow('대표 옵션', cur.options.slice(0,4).join(' · '), nw.options.slice(0,4).join(' · '))}
      </div>
    </section>
    <section class="mpc-sec"><div class="mpc-sec__t">구독 조건</div>
      <div class="mpc-cmp">
        ${cmpRow('월 이용요금', `월 ${man(curFee)}만원`, `월 ${man(newFee)}만원`)}
        ${cmpRow('전환 할인', '–', `−${man(base-newFee)}만원/월`)}
        ${cmpRow('이용 기간', '진행 중', '60개월 갱신')}
        ${cmpRow('위약금', '–', '0원')}
        ${cmpRow('출고 예정일', '이용 중', deliveryText(nw))}
      </div>
    </section>`;

  $('#mpcFoot').innerHTML = `
    <div class="mpc-foot__note"><b>위약금 0원</b>으로 지금 바로 변경 · 남은 계약은 차액만 정산 · 월 요금 변화 <b style="color:var(--ink)">${deltaTxt}</b></div>
    <button class="ghost" data-mpc-close>취소</button>
    <button class="primary" id="mpcApply">${nw.brand} ${nw.model}(으)로 변경 신청</button>`;
}
function openChange(){
  if(typeof CARS==='undefined'){ toast('차량 데이터를 불러오지 못했어요'); return; }
  renderCompare();
  $('#mpcModal').classList.add('is-open');
  document.body.style.overflow='hidden';
}
function closeChange(){ $('#mpcModal').classList.remove('is-open'); document.body.style.overflow=''; }

$('#mpChangeModel').addEventListener('click', openChange);
$('#mpcModal').addEventListener('click', e=>{
  if(e.target.closest('[data-mpc-close]')) return closeChange();
  if(e.target.closest('#mpcApply')){ const nw=carById(MPC.selected); closeChange(); toast(`${nw.brand} ${nw.model} 변경 신청이 접수되었어요`); }
});
$('#mpcModal').addEventListener('change', e=>{ const sel=e.target.closest('.mpc-select'); if(sel){ MPC.selected=sel.value; renderCompare(); } });
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && $('#mpcModal').classList.contains('is-open')) closeChange(); });
