export default function MaintenancePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                시스템 점검 중입니다
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
                더 나은 서비스를 위해 현재 시스템 점검 및 업그레이드 작업을 진행하고 있습니다.
                잠시 후 다시 접속해 주시기 바랍니다.
            </p>
            <div className="text-sm text-slate-400">
                문의: hello@example.com
            </div>
        </div>
    );
}
