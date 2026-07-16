#!/bin/bash
# SOPICK 컨셉 시안 일괄 배포 스크립트
# 사용법: ./deploy_concepts.sh ["커밋 메시지"]
#
# 시안별 원본 위치 (각 작업 폴더에서 최신본을 가져옴):
#   시안 1 (마켓플레이스)  : 이 저장소 자체 (src/ — Actions가 빌드)
#   시안 2 (프리미엄 구독) : ../sopick_subscription/concepts/concept2/
#   시안 3 (AI 에이전트)   : ../sopick_agent/concepts/concept3/
#
# 원본 폴더가 없으면 해당 시안은 건너뛰고, 변경이 없으면 커밋하지 않습니다.

set -euo pipefail
cd "$(dirname "$0")"

MSG="${1:-시안 일괄 업데이트}"

declare -a SOURCES=(
  "../sopick_subscription/concepts/concept2|concepts/concept2"
  "../sopick_agent/concepts/concept3|concepts/concept3"
)

echo "── 원본 → 저장소 동기화 ──"
for entry in "${SOURCES[@]}"; do
  SRC="${entry%%|*}"
  DST="${entry##*|}"
  if [ -d "$SRC" ]; then
    mkdir -p "$DST"
    rsync -a --delete "$SRC/" "$DST/"
    echo "  ✓ $SRC → $DST"
  else
    echo "  – $SRC 없음 (건너뜀)"
  fi
done

if git diff --quiet && git diff --cached --quiet && [ -z "$(git status --porcelain)" ]; then
  echo "── 변경 사항 없음. 배포할 내용이 없습니다."
  exit 0
fi

echo "── 커밋 & 푸시 ──"
git add -A
git commit -m "$MSG"
git push

echo "── 완료. GitHub Actions가 1분 내에 배포합니다 ──"
echo "   진행 확인: https://github.com/socar-haul/sopick_concept/actions"
echo "   시안 허브: https://socar-haul.github.io/sopick_concept/"
