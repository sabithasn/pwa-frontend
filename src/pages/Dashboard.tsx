import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type FormSubmission } from '../db/db';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [isSeeding, setIsSeeding] = useState(false);
    const submissions = useLiveQuery(() => db.submissions.orderBy('createdAt').reverse().toArray());

    useEffect(() => {
        // Seed initial mock data if empty
        const seedMockData = async () => {
            const count = await db.submissions.count();
            if (count === 0 && !isSeeding) {
                setIsSeeding(true);
                const mockScans: FormSubmission[] = [
                    {
                        formId: 'SAIC-J-6606',
                        payload: { title: 'Inst Cable - Pre-Comm (Mock A)' },
                        status: 'synced',
                        createdAt: Date.now() - 86400000 * 2,
                        updatedAt: Date.now() - 86400000 * 2
                    },
                    {
                        formId: 'SAIC-J-6606',
                        payload: { title: 'Inst Cable - Pre-Comm (Mock B)' },
                        status: 'pending_sync',
                        createdAt: Date.now() - 3600000,
                        updatedAt: Date.now() - 3600000
                    },
                    {
                        formId: 'SAIC-J-6606',
                        payload: { title: 'Inst Cable - Pre-Comm (Mock C)' },
                        status: 'draft',
                        createdAt: Date.now() - 500000,
                        updatedAt: Date.now() - 500000
                    }
                ];
                await db.submissions.bulkAdd(mockScans);
                setIsSeeding(false);
            }
        };
        seedMockData();
    }, [isSeeding]);

    const getStatusIcon = (status: FormSubmission['status']) => {
        switch (status) {
            case 'synced': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'pending_sync': return <Clock className="w-5 h-5 text-amber-500" />;
            case 'draft': return <AlertCircle className="w-5 h-5 text-slate-400" />;
            default: return null;
        }
    };

    const getStatusText = (status: FormSubmission['status']) => {
        switch (status) {
            case 'synced': return 'Synced';
            case 'pending_sync': return 'Pending Sync';
            case 'draft': return 'Draft';
            default: return 'Unknown';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recent Scans</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage your inspection forms and sync status</p>
                </div>
                <Link
                    to="/scan"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                    New Scan
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-xl ring-1 ring-slate-900/5">
                <ul className="divide-y divide-slate-100">
                    {submissions?.length === 0 ? (
                        <li className="p-8 text-center text-slate-500">
                            No scans found. Start by creating a new scan.
                        </li>
                    ) : (
                        submissions?.map((sub) => (
                            <li key={sub.id} className="hover:bg-slate-50 transition-colors cursor-pointer block p-4 sm:px-6 group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center min-w-0 gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-slate-900 truncate">
                                                {sub.payload.title || sub.formId}
                                            </p>
                                            <p className="flex items-center text-xs text-slate-500 mt-1 truncate">
                                                ID: {sub.formId} • {new Date(sub.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                                            {getStatusIcon(sub.status)}
                                            <span className="hidden sm:inline">{getStatusText(sub.status)}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
