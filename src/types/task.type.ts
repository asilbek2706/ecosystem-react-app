import { ReactElement } from 'react';

export type TaskStatus = 'pending' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ITaskCreator {
    username: string;
    first_name?: string;
    last_name?: string;
}

export interface ITask {
    id: string;
    title: string;
    description: string;
    department_code: string;
    status: TaskStatus;
    priority: TaskPriority;
    created_by: ITaskCreator;
    deadline: string | null;
    created_at: string;
}

export interface StatusStyle {
    color: 'warning' | 'success' | 'info' | 'secondary' | 'default';
    icon: ReactElement; // TS2769 xatosini yo'qotish uchun ReactElement ishlatiladi
    label: string;
}

export interface ITaskListResponse {
    status: boolean;
    data: {
        tasks: ITask[];
    };
    message: string;
}

export interface ITaskDetailResponse {
    status: boolean;
    data: ITask;
    message: string;
}
