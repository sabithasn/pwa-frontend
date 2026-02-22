import { useState } from 'react';
import { QrCode, FileJson, AlertCircle } from 'lucide-react';
import DynamicForm from '../components/DynamicForm';
import { db } from '../db/db';
import { useNavigate } from 'react-router-dom';

// Import our exhaustive schema for mocking
import mockSchema from '../exhaustive_form.json';

const Scan = () => {
    const [formSchema, setFormSchema] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleMockLoad = () => {
        setFormSchema(mockSchema);
        setError(null);
    };

    // When form is submitted from DynamicForm
    const handleFormSubmit = async (payload: any) => {
        try {
            await db.submissions.add({
                formId: formSchema.formId || 'unknown',
                payload,
                status: 'pending_sync',
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
            navigate('/', { replace: true });
        } catch (err) {
            console.error('Save failed', err);
            setError('Failed to save submission to offline storage.');
        }
    };

    if (formSchema) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm ring-1 ring-slate-900/5">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{formSchema.formTitle || 'Inspection Form'}</h2>
                        <p className="text-sm text-slate-500">ID: {formSchema.formId}</p>
                    </div>
                    <button
                        onClick={() => setFormSchema(null)}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
                <DynamicForm schema={formSchema} onSubmit={handleFormSubmit} />
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto space-y-8 mt-10">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Scanner</h1>
                <p className="text-slate-500">Scan a QR code to load the dynamic inspection form</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center border-2 border-dashed border-slate-200">
                    <QrCode className="w-10 h-10 text-slate-400" />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2 text-left">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-500 rounded-lg font-medium cursor-not-allowed"
                    >
                        <QrCode className="w-5 h-5" />
                        Start Device Camera (WIP)
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-sm font-medium leading-6">
                            <span className="bg-white px-6 text-slate-400">Or use mock data</span>
                        </div>
                    </div>

                    <button
                        onClick={handleMockLoad}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg font-medium transition-colors"
                    >
                        <FileJson className="w-5 h-5" />
                        Load Exhaustive Form JSON
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Scan;
