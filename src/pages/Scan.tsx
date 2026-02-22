import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import DynamicForm from '../components/DynamicForm';
import { db } from '../db/db';
import { useNavigate } from 'react-router-dom';

// Import our exhaustive schema for mocking
import mockSchema from '../exhaustive_form.json';

const Scan = () => {
    // Directly initialize state with the mock schema bypasses the scanner view
    const [formSchema] = useState<any | null>(mockSchema);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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

    if (!formSchema) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-slate-500">No schema loaded.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm ring-1 ring-slate-900/5">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">{formSchema.formTitle || 'Inspection Form'}</h2>
                    <p className="text-sm text-slate-500">ID: {formSchema.formId}</p>
                </div>
                {/* Optional: A button to go back to dashboard instead of clearing the form schema to null */}
                <button
                    onClick={() => navigate('/', { replace: true })}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    Cancel
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2 text-left">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <DynamicForm schema={formSchema} onSubmit={handleFormSubmit} />
        </div>
    );
};

export default Scan;
