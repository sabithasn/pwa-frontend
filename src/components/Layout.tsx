import { Outlet, Link, useNavigate } from 'react-router-dom'
import { ClipboardList, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Layout = () => {
    const { logout, username } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10 w-full">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary-600">
                        <ClipboardList className="w-6 h-6" />
                        <span className="font-bold text-xl tracking-tight">Inspector</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-500 hidden sm:block mr-2">Hello, {username || 'User'}</span>
                        <Link to="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Dashboard</Link>
                        <Link to="/scan" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">New Scan</Link>
                        <button
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                            title="Log Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
