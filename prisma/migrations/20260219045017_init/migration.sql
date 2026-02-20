-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "link" TEXT,
    "github" TEXT,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HeroContent" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'hero',
    "badge" TEXT NOT NULL DEFAULT 'Open to opportunities',
    "titleLine1" TEXT NOT NULL DEFAULT '안녕하세요,',
    "titleLine2" TEXT NOT NULL DEFAULT '개발자',
    "titleSuffix" TEXT NOT NULL DEFAULT '입니다.',
    "subtitle" TEXT NOT NULL DEFAULT '사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.
깔끔한 코드와 아름다운 인터페이스를 만들어 갑니다.',
    "ctaPrimary" TEXT NOT NULL DEFAULT '프로젝트 보기',
    "ctaSecondary" TEXT NOT NULL DEFAULT '연락하기'
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'settings',
    "siteName" TEXT NOT NULL DEFAULT 'Portfolio',
    "siteDescription" TEXT NOT NULL DEFAULT '프론트엔드 개발자 포트폴리오 - React, Next.js, TypeScript 전문',
    "footerTagline" TEXT NOT NULL DEFAULT 'Minimalist Tech Professional',
    "githubUrl" TEXT NOT NULL DEFAULT 'https://github.com',
    "linkedinUrl" TEXT NOT NULL DEFAULT 'https://linkedin.com',
    "email" TEXT NOT NULL DEFAULT 'hello@example.com'
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
