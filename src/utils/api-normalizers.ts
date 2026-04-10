import type { IDepartment } from '@/types/department.type.ts';
import type { ITask } from '@/types/task.type.ts';

type WrappedList<T, K extends string> = {
    status?: boolean;
    data?: Partial<Record<K, T[]>>;
};

type WrappedDetail<T> = {
    status?: boolean;
    data?: T;
};

export const normalizeDepartmentList = (
    payload: IDepartment[] | WrappedList<IDepartment, 'departments'> | undefined
): IDepartment[] => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data?.departments))
        return payload.data.departments;
    return [];
};

export const normalizeTaskList = (
    payload: ITask[] | WrappedList<ITask, 'tasks'> | undefined
): ITask[] => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data?.tasks)) return payload.data.tasks;
    return [];
};

export const normalizeTaskDetail = (
    payload: ITask | WrappedDetail<ITask> | undefined
): ITask | null => {
    if (!payload) return null;
    if ('id' in payload) return payload;
    return payload.data ?? null;
};
