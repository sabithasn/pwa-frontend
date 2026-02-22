import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, Loader2 } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return;

        setIsSubmitting(true);
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            await login(username);
            navigate('/', { replace: true });
        } catch (err) {
            console.error('Login failed', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl ring-1 ring-slate-900/5">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="h-8 w-8 text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Inspector PWA
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to access your offline dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4 rounded-md shadow-sm text-left">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                                placeholder="Enter any username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                                placeholder="Enter any password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting || !username || !password}
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                        <LogIn className="h-5 w-5 text-primary-500 group-hover:text-primary-400 transition-colors" />
                                    </span>
                                    Sign In
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
