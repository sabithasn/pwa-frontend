// DynamicForm component for rendering exhaustive JSON schema manually
import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

interface DynamicFormProps {
    schema: any;
    onSubmit: (payload: any) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit }) => {
    // Simple state to hold form values. In a production app, use react-hook-form
    const [formData, setFormData] = useState<any>({});

    const handleFieldChange = (sectionId: string, fieldId: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [sectionId]: {
                ...(prev[sectionId] || {}),
                [fieldId]: value
            }
        }));
    };

    const handleTableChange = (sectionId: string, subSectionId: string, rowIdx: number, columnId: string, value: any) => {
        setFormData((prev: any) => {
            const sectionData = prev[sectionId] || {};
            const subSectionData = sectionData[subSectionId] || {};
            const rowData = subSectionData[rowIdx] || {};
            return {
                ...prev,
                [sectionId]: {
                    ...sectionData,
                    [subSectionId]: {
                        ...subSectionData,
                        [rowIdx]: { ...rowData, [columnId]: value }
                    }
                }
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const renderField = (field: any, sectionId: string) => {
        const value = formData[sectionId]?.[field.fieldId] || '';

        switch (field.type) {
            case 'text':
            case 'datetime':
            case 'date':
                return (
                    <div key={field.fieldId}>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type={field.type === 'datetime' ? 'datetime-local' : field.type}
                            required={field.required}
                            value={value}
                            onChange={(e) => handleFieldChange(sectionId, field.fieldId, e.target.value)}
                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 bg-slate-50 text-slate-900 border"
                        />
                    </div>
                );
            case 'checkbox_group':
            case 'radio':
                return (
                    <div key={field.fieldId}>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className="space-y-2">
                            {field.options?.map((opt: string) => (
                                <label key={opt} className="flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        type={field.type === 'radio' ? 'radio' : 'checkbox'}
                                        name={`${sectionId}-${field.fieldId}`}
                                        value={opt}
                                        onChange={(e) => handleFieldChange(sectionId, field.fieldId, e.target.value)}
                                        className="text-primary-600 focus:ring-primary-500"
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                );
            case 'signature_pad':
                return (
                    <div key={field.fieldId} className="col-span-full">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            {field.label}
                        </label>
                        <div className="w-full h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                            [Signature Pad Workspace]
                        </div>
                    </div>
                );
            default:
                return null; // unsupported simple field
        }
    };

    const renderSection = (section: any) => {
        switch (section.type) {
            case 'fieldset':
                return (
                    <div key={section.sectionId} className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-slate-900/5 mb-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">{section.sectionTitle}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.fields?.map((f: any) => renderField(f, section.sectionId))}
                        </div>
                    </div>
                );

            case 'table_group':
                return (
                    <div key={section.sectionId} className="mb-6 space-y-6">
                        <h3 className="text-xl font-black text-slate-900 px-2">{section.sectionTitle}</h3>
                        {section.sub_sections?.map((sub: any) => (
                            <div key={sub.subSectionId} className="bg-white rounded-xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                    <h4 className="font-bold text-slate-800 text-sm">{sub.subSectionId}. {sub.subSectionTitle}</h4>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-white">
                                            <tr>
                                                {sub.columns?.map((col: any) => (
                                                    <th key={col.columnId} className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                        {col.label}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {sub.rows?.map((row: any, rIdx: number) => (
                                                <tr key={rIdx} className="hover:bg-slate-50">
                                                    {sub.columns?.map((col: any) => {
                                                        const cellVal = formData[section.sectionId]?.[sub.subSectionId]?.[rIdx]?.[col.columnId] ?? row[col.columnId];
                                                        return (
                                                            <td key={col.columnId} className={`px-3 py-3 text-sm ${col.editable === false ? 'text-slate-500' : 'text-slate-900'} align-top`}>
                                                                {col.type === 'checkbox' ? (
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={!!cellVal}
                                                                        onChange={e => handleTableChange(section.sectionId, sub.subSectionId, rIdx, col.columnId, e.target.checked)}
                                                                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600 mt-1"
                                                                    />
                                                                ) : col.type === 'date' ? (
                                                                    <input
                                                                        type="date"
                                                                        disabled={col.visibleIf && !formData[section.sectionId]?.[sub.subSectionId]?.[rIdx]?.[col.visibleIf]}
                                                                        value={cellVal || ''}
                                                                        onChange={e => handleTableChange(section.sectionId, sub.subSectionId, rIdx, col.columnId, e.target.value)}
                                                                        className="text-sm border-slate-300 rounded-md shadow-sm disabled:opacity-50 disabled:bg-slate-100 px-2 py-1"
                                                                    />
                                                                ) : col.type === 'textarea' ? (
                                                                    <span className="block min-w-[250px]">{row[col.columnId]}</span> // Typically Acceptance Criteria is static
                                                                ) : (
                                                                    <span>{row[col.columnId]}</span>
                                                                )}
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'info_list':
                return (
                    <div key={section.sectionId} className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-bold text-blue-900 mb-2">{section.sectionTitle}</h3>
                                <ul className="space-y-1">
                                    {section.items?.map((item: string, idx: number) => (
                                        <li key={idx} className="text-xs text-blue-800/80">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'signature_group':
                return (
                    <div key={section.sectionId} className="mb-8">
                        <h3 className="text-xl font-black text-slate-900 mb-4 px-2">{section.sectionTitle}</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {section.roles?.map((role: any) => (
                                <div key={role.roleId} className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-slate-900/5">
                                    <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 text-sm">{role.roleName}</h4>
                                    <div className="space-y-4">
                                        {role.fields?.map((f: any) => renderField(f, `${section.sectionId}_${role.roleId}`))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return <div key={section.sectionId}>Unsupported section type: {section.type}</div>;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="pb-24">
            {schema?.sections?.map(renderSection)}

            {/* Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <span className="text-sm font-medium text-slate-500 hidden sm:inline-block">Auto-saving...</span>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button type="button" className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">
                            Save Draft
                        </button>
                        <button type="submit" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
                            <Save className="w-4 h-4" />
                            Submit to Queue
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default DynamicForm;
