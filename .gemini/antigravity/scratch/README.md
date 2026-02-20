# Strategic IT Portfolio

A modern, high-performance portfolio website designed for a **Strategic IT Professional**.
This project showcases a career focused on Digital Transformation (DX), ERP Innovation, and Infrastructure Stability.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Key Features

-   **Strategic Visualization**: Displays projects with "Strategic Difficulty" and "Organizational Impact" metrics.
-   **Smart Filtering**: Organize projects by key domains: `Strategy`, `ERP`, `Infrastructure`.
-   **Modern Tech Stack**: Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.
-   **Dynamic Animations**: Smooth transitions and interactive elements using Framer Motion.
-   **Database Integration**: SQLite + Prisma ORM for managing projects and skills data.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Database**: [SQLite](https://www.sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
-   **Animation**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```
.
├── app/                  # Next.js App Router pages
├── components/           # Reusable UI components
│   ├── home/             # Homepage specific components (Hero, ProjectList, etc.)
│   └── layout/           # Layout components (Header, Footer)
├── prisma/               # Database schema and migrations
├── scripts/              # Data seeding and maintenance scripts
└── public/               # Static assets
```

## 🏁 Getting Started

### Prerequisites

-   Node.js 18+ installed

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/dk1927/232.git
    cd 232
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Database**
    ```bash
    # Create SQLite database and run migrations
    npx prisma migrate dev
    
    # Seed data (Projects & Skills)
    npx ts-node scripts/update_projects.ts
    npx ts-node scripts/update_skills.ts
    npx ts-node scripts/update_hero.ts
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
