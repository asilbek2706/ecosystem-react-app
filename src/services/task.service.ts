import api from '../api/axios';
import { ITaskListResponse, ITaskDetailResponse } from '../types/task.type';

export const TaskService = {
    getTasksByDepartment: async (deptCode: string) => {
        return await api.get<ITaskListResponse>(
            `/tasks/list/?search=${deptCode}`
        );
    },

    getTaskDetail: async (id: string) => {
        return await api.get<ITaskDetailResponse>(`/tasks/detail/${id}/`);
    },

    createTask: async (payload: {
        title: string;
        description: string;
        department_code: string;
        priority: string;
        status: string;
        deadline: string | null;
    }) => {
        return await api.post('/tasks/list/', payload);
    },
};
