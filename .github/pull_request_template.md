## 🔀 Pull Request Title
간결하고 명확한 제목 작성 (예: `feat: 로그인 기능 구현`)
- Closes #3 (이슈 번호가 있다면)

<br>

## 📌 PR 설명
이번 PR에서 어떤 작업을 했는지 요약해주세요.
- [ ] 
- [ ] 
- [ ] 

<br>

## 📷 스크린샷
UI 변경이 있을 경우 스크린샷을 첨부해주세요.

<br>

## ✅ FSD Architecture Checklist
Feature-Sliced Design 원칙을 준수했는지 확인해주세요.

### 레이어 규칙
- [ ] 상위 레이어가 하위 레이어만 import 하고 있음 (app → widgets → entities → shared)
- [ ] 동일 레이어 간 import가 없음
- [ ] 순환 의존성이 없음

### 네이밍 컨벤션
- [ ] 파일명이 정해진 패턴을 따름 (*.ui.tsx, *.hook.ts, *.api.ts 등)
- [ ] 폴더명이 kebab-case로 작성됨
- [ ] 배럴 익스포트(index.ts)를 사용함

### Import 경로
- [ ] 절대 경로 사용 (@/shared, @/entities, @/widgets, @/app)
- [ ] 상대 경로 사용 최소화

## 🔍 추가 설명
리뷰어가 알아야 할 추가 정보나 요청사항이 있다면 적어주세요.
