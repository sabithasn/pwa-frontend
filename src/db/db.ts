import Dexie, { type EntityTable } from 'dexie';

export interface UserSession {
    id: string;
    username: string;
    token: string;
    loginTime: number;
}

export interface FormSubmission {
    id?: number;
    formId: string;
    payload: any;
    status: 'draft' | 'pending_sync' | 'synced';
    createdAt: number;
    updatedAt: number;
}

export const db = new Dexie('InspectionDB') as Dexie & {
    sessions: EntityTable<UserSession, 'id'>;
    submissions: EntityTable<FormSubmission, 'id'>;
};

db.version(1).stores({
    sessions: 'id, username', // Primary key and indexed props
    submissions: '++id, formId, status, createdAt' // ++id auto-increments
});
