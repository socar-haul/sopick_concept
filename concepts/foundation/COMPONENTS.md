# SOPICK Foundation — 컴포넌트 인벤토리 (개발자 핸드오프)

이 시안은 **SOCAR-FRAME 2.0** 컴포넌트 규격(치수·상태·토큰)을 반응형 웹으로 구현한 것입니다.
프로덕션 전환 시 아래 매핑대로 **`@socar-inc/socar-frame-components`** 로 1:1 교체하세요.
(React/Tailwind 전환은 `socar-frame-react` 스킬, Code Connect 매핑 규칙 포함)

## 사용법

모든 페이지 `<head>`에 순서대로 로드:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css">
<link rel="stylesheet" href="foundation/tokens.css">
<link rel="stylesheet" href="foundation/components.css">
<!-- 페이지 고유 스타일 -->
<script src="foundation/foundation.js" defer></script>
```

- `foundation.js`는 DOMContentLoaded에서 `.sf-seg`·`.sf-tabs`·`.sf-chip`·`.sf-field__box`·모달을 **자동 초기화**합니다.
- 전역 API: `sfModal.open(id)` / `sfModal.close(id)` / `sfSnackbar(msg, {duration})`

## 반응형 규칙

| 구간 | 동작 |
|------|------|
| 데스크톱 (>720px) | 콘텐츠 max-width `--page-max`(1200), TopAppBar 56px, 모달=센터 다이얼로그 |
| 모바일/웹뷰 (≤720px) | 좌우 패딩 16px, TopAppBar 52px(SOCAR 실측), 모달=하단 시트(dvh 대응) |

## 컴포넌트 매핑표

| 시안 클래스 | SOCAR-FRAME 컴포넌트 | React 컴포넌트 | 비고 |
|------------|---------------------|---------------|------|
| `.sf-topbar` (+`--back`) | TopAppBar | `TopAppBar` | 모바일 52px, LeftSlot/Title/Trailing |
| `.sf-btn--{lg,md,sm,xs}` + `--fill-primary/secondary/tertiary`, `--outlined-primary/secondary` | ActionButton | `ActionButton` | size×styleType×variant. 높이 고정 없음(padding 기반) |
| `.sf-txtbtn` | TextButton | `TextButton` | primary/secondary/tertiary, underline |
| `.sf-iconbtn--{xs,sm,md,lg}` | IconButton | `IconButton` | 원형, 배경 투명 |
| `.sf-field` (+`--outlined/--underlined`, `.is-error`) | Input | `Input` | filled 기본. label/helper/clear/error |
| `.sf-field` textarea | TextArea | `TextArea` | variant 동일 |
| `.sf-seg` (+`--dark`) | SegmentedControl | `SegmentedControl` | type=slide, 흰 pill. 다크는 브랜드 커스텀 |
| `.sf-tabs` | Tab | `Tab` | 언더라인 인디케이터, 가로 스크롤 |
| `.sf-chip--{md,sm}` | Chip | `Chip` | Selection Chip, `aria-pressed` |
| `.sf-tag--{sm,md,lg}` + `--info/positive/caution/negative/outlined` | Tag | `Tag` | fill, 시맨틱 weak배경+strong텍스트 |
| `.sf-card` | (레이아웃) | — | header/divider/body/footer 표준 |
| `.sf-list` / `.sf-list__row` | (레이아웃) | — | 리스트 그룹, 마지막 row 구분선 제거 |
| `.sf-check` / `.sf-radio` | Checkbox / Radio | `Checkbox`/`Radio` | label 래핑 |
| `.sf-badge` (+`--dot`) | Badge | `Badge` | standard/dot |
| `.sf-modal` | BottomSheet(모바일)/Modal(데스크톱) | `BottomSheet` | Footer 1:2 표준(secondary:primary) |
| `.sf-alert` | Alert | `Alert` | 센터 모달, GraphicSlot/Title/Body/ButtonSlot |
| `.sf-snackbar` | Snackbar | `Snackbar` | 하단 토스트, 3초 자동 해제 |
| `.sf-skeleton` | Skeleton | `Skeleton` | shimmer |

> Figma 컴포넌트 키(`importComponentByKeyAsync`용)는 SOCAR 플러그인의
> `shared/references/socar_frame_components.md` "Figma 컴포넌트 키" 섹션 참조.

## 토큰 규칙 (임의 색상 금지)

- 색상은 **시맨틱 토큰 우선**: `--text-*`, `--primary-*`, `--status-*`, `--border-*`
- 간격은 4px 그리드(`--sp-*`), 라운드는 `--radius-*`(200~500), 타이포는 `--title*/--body*/--heading*`
- 콘텐츠 좌우 기준 패딩 = `--page-pad` (모바일 16px = spacing-400)

## Footer / CTA 표준

- BottomSheet Footer 2버튼 = **1:2 비율** → 좌측 `fill-secondary`(닫기/취소), 우측 `fill-primary`(핵심 CTA)
- Alert 2버튼 = 1:1, 취소 좌측 / 확인 우측
