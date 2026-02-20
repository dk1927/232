
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projects = [
    {
        title: "1. PLM 전면 업그레이드 프로젝트 (2024)",
        description: "단순 업그레이드가 아닌 PLM 생태계 전면 교체. PLM TC 11.4 → 14, Edge ST10 → Edge 2023, MSSQL/WinSrv 2012 → 2019 동시 마이그레이션 수행. 전사 기술연구소 핵심 시스템 리스크를 제거하고 전략적 디지털 전환을 달성함.",
        tags: JSON.stringify(["PLM", "Teamcenter", "Solid Edge", "MSSQL", "Windows Server", "Migration"]),
        order: 1,
        createdAt: new Date("2024-12-01"),
        metadata: JSON.stringify({ difficulty: 5, impact: "전사 R&D", type: "Strategic" }),
    },
    {
        title: "2. 그룹웨어 전면 개편 프로젝트 (2025)",
        description: "WinSrv 2012 → 2022 업그레이드 및 모바일/메신저/채팅 신규 도입. 백신 충돌 개선 및 다중 백업 체계 구축. 사용자 교육을 포함한 Change Management를 수행하여 업무 방식의 변화를 이끌어냄.",
        tags: JSON.stringify(["Groupware", "Windows Server 2022", "Mobile", "Collaboration", "Change Management"]),
        order: 2,
        createdAt: new Date("2025-02-01"),
        metadata: JSON.stringify({ difficulty: 4, impact: "전사 사무/공장", type: "Strategic" }),
    },
    {
        title: "3. 소스관리 시스템 구축 (Gitea) (2025)",
        description: "전산팀 개발 체계 고도화를 위한 NAS 기반 Docker 환경 구성 및 Gitea 도입. 형상관리 기반을 확보하고 DevOps의 초석을 마련함.",
        tags: JSON.stringify(["Gitea", "Docker", "Git", "Synology NAS", "DevOps"]),
        order: 3,
        createdAt: new Date("2025-02-15"),
        metadata: JSON.stringify({ difficulty: 4, impact: "전산팀", type: "Strategic" }),
    },
    {
        title: "4. ERP 속도 개선 및 프로시저화 (2020)",
        description: "재고마감 프로시저 구조 개선 및 임시테이블 구조 변경을 통한 대용량 데이터 처리 속도 획기적 개선. 데이터 엔진 레벨의 최적화 수행.",
        tags: JSON.stringify(["ERP", "MSSQL", "Optimization", "Database Tuning"]),
        order: 4,
        createdAt: new Date("2020-06-01"),
        metadata: JSON.stringify({ difficulty: 4, impact: "데이터 엔진 개선", type: "ERP" }),
    },
    {
        title: "5. ERP 내부쿼리 → 프로시저 전환 (2021)",
        description: "ERP 내부 하드코딩된 쿼리 59건 중 49건을 저장 프로시저(SP)로 전환하여 기술적 부채 제거. UI 및 조회조건 개선 병행.",
        tags: JSON.stringify(["ERP", "Refactoring", "Stored Procedure", "Legacy Modernization"]),
        order: 5,
        createdAt: new Date("2021-03-01"),
        metadata: JSON.stringify({ difficulty: 3, impact: "기술적 부채 제거", type: "ERP" }),
    },
    {
        title: "6. 현장공지관리 시스템 개발 (2025)",
        description: "제조현장 디지털화를 위한 ERP 연동 공지 시스템 개발 및 라인 모니터 시범 운영.",
        tags: JSON.stringify(["ERP Extension", "Smart Factory", "Digitalization", "Manufacturing"]),
        order: 6,
        createdAt: new Date("2025-01-15"),
        metadata: JSON.stringify({ difficulty: 3, impact: "제조현장 디지털화", type: "ERP" }),
    },
    {
        title: "7. 제안관리 / 포장입고 / CAS 통신 (2019~2020)",
        description: "제안관리 시스템 전사 통일, 포장입고 실시간 모니터링 구축, RS232 계량기 통신 개발 및 PDA 기종 컨버전 수행. 스마트팩토리 초기 단계 구축.",
        tags: JSON.stringify(["Smart Factory", "RS232", "PDA", "Monitoring", "System Integration"]),
        order: 7,
        createdAt: new Date("2020-12-01"),
        metadata: JSON.stringify({ difficulty: 3, impact: "스마트팩토리 구축", type: "ERP" }),
    },
    {
        title: "8. 주요 서버 가상화 이관 (2023)",
        description: "MSSQL, UNIERP, BIOSTAR 등 주요 서버를 가상화 환경으로 이관하여 서버 구조 리스크 감소 및 가용성 확보.",
        tags: JSON.stringify(["Virtualization", "Server Migration", "P2V", "Infrastructure"]),
        order: 8,
        createdAt: new Date("2023-11-01"),
        metadata: JSON.stringify({ difficulty: 4, impact: "서버 리스크 감소", type: "Infrastructure" }),
    },
    {
        title: "9. 네트워크 공사 및 백본 교체 (2021~2024)",
        description: "신공장 네트워크 공사 및 포머 설비 네트워크 구축. 노후 백본 스위치 및 Cisco 장비 교체로 공장 통합 인프라 성능 향상.",
        tags: JSON.stringify(["Network Infrastructure", "Cisco", "Backbone Switch", "Factory Network"]),
        order: 9,
        createdAt: new Date("2024-10-01"),
        metadata: JSON.stringify({ difficulty: 4, impact: "공장 인프라 통합", type: "Infrastructure" }),
    },
    {
        title: "10. 재해복구 훈련 반복 수행 (2021, 2023, 2024)",
        description: "UNIERP 및 MSSQL 복구 훈련 정례화. DR 체계 검증을 통한 IT 거버넌스 성숙도 및 비즈니스 연속성 확보.",
        tags: JSON.stringify(["Disaster Recovery", "BCP", "IT Governance", "Training"]),
        order: 10,
        createdAt: new Date("2024-12-15"),
        metadata: JSON.stringify({ difficulty: 3, impact: "IT 거버넌스 성숙", type: "Infrastructure" }),
    },
    {
        title: "11. FTA 데이터 관리 프로젝트",
        description: "매월 데이터 인터페이스 점검 및 FTA 시스템 유지보수. 법적 리스크 대응 체계화.",
        tags: JSON.stringify(["FTA", "Data Management", "Compliance", "Interface"]),
        order: 11,
        createdAt: new Date("2025-02-01"),
        metadata: JSON.stringify({ difficulty: 2, impact: "법적 리스크 대응", type: "Operations" }),
    },
    {
        title: "12. IT 인프라 및 시스템 지속 운영 (Operations)",
        description: "연간 상시 ERP 개발/수정, 서버 21대/네트워크 32대 일일 점검, 월 30~50건 PC 지원, 보안 솔루션(PLM/DLP/백신) 및 그룹웨어 외부업체 관리.",
        tags: JSON.stringify(["IT Operations", "Maintenance", "Helpdesk", "Vendor Management", "Infrastructure"]),
        order: 12,
        createdAt: new Date("2025-02-20"),
        metadata: JSON.stringify({ difficulty: 3, impact: "조직 기반 유지", type: "Operations" }),
    }
];

async function main() {
    console.log("Deleting existing projects...");
    await prisma.project.deleteMany({});

    console.log("Inserting new projects with metadata...");
    for (const project of projects) {
        await prisma.project.create({
            data: {
                ...project,
                locale: "ko",
            },
        });
    }

    console.log("Projects updated successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
