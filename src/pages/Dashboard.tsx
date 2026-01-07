import { Sidebar } from "../components/Sidebar";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen bg-surface-50">
            <Sidebar />

            <main className="flex-1 p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-500 mb-4">
                        <span className="text-4xl">👋</span>
                    </div>
                    <h1 className="text-4xl font-bold text-surface-900 font-serif">Welcome to Dashboard</h1>
                    <p className="text-surface-400 text-lg max-w-md mx-auto">
                        You have successfully completed your onboarding. Your account is now active in the <span className="text-warning-600 font-bold">Test Environment</span>.
                    </p>
                </div>
            </main>
        </div>
    );
}
