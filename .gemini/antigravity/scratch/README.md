# Portfolio

개인 브랜딩 및 기술 스택 내재화를 위한 포트폴리오 웹사이트입니다.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Animation**: Framer Motion
- **Form**: React Hook Form
- **Theme**: next-themes (Dark Mode)

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인하세요.

## 프로젝트 구조

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── TechStack.tsx
│   │   ├── ProjectList.tsx
│   │   └── ContactForm.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ThemeProvider.tsx
├── data/
│   ├── projects.ts
│   └── skills.ts
└── lib/
    └── utils.ts
```
