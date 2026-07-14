# SOPICK Marketplace (Concept 1)

기존 SOPICK 사이트와 분리된 마켓플레이스 컨셉 랜딩 페이지입니다.
React 19 + Vite + Tailwind CSS v4로 구현했습니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 프로덕션 빌드
```

## 레이아웃 규칙

- 디자인 캔버스 1920px 기준, 컨테이너 최대 너비 **1440px** 중앙 정렬
- 컨테이너 좌우 아웃 마진 **80px** (`.shell` 클래스, `src/index.css`)
- 반응형: 모바일(≤767px) 20px, 태블릿(768–1279px) 40px 마진

## 구성

| 섹션 | 파일 | 인터랙션 |
| --- | --- | --- |
| 헤더 | `src/components/Header.jsx` | 스티키 + 스크롤 그림자, 모바일 햄버거 |
| 히어로 + 검색 패널 | `Hero.jsx`, `SearchPanel.jsx` | 탭/기간/요금/조건 필터에 따라 검색 가능 차량 수 실시간 갱신 |
| 인기 카테고리 | `Categories.jsx` | 칩 선택 시 피처드 카드 전환 |
| 월 요금별 인기차종 | `Pricing.jsx` | 예산·계약 기간 선택 시 실매물 필터링 + 월 요금 재계산 |
| 비교 바 | `CompareBar.jsx` | 비교 담기(최대 3대) 시 하단 플로팅 바 |
| 신뢰/가이드 | `Trust.jsx` | — |
| 푸터 | `Footer.jsx` | — |

차량 데이터·요금 계수는 `src/data.js`에 있습니다 (24개월 기준 월 요금,
계약 기간별 계수로 재계산). 차량 이미지는 상위 프로젝트 `images/`에서
배지 없는 컷만 골라 `public/cars/`에 복사했습니다.
