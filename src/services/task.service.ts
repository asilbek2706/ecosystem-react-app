import api from '../api/axios';
import type { ITask, ITaskListResponse } from '../types/task.type.ts';

export const TaskService = {
    getTasksByDepartment: async (deptCode: string) => {
        return await api.get<ITaskListResponse>(
            `/tasks/list/?search=${deptCode}`
        );
    },

    getTaskDetail: async (id: string) => {
        return await api.get<ITask>(`/tasks/detail/${id}/`);
    },
};
