import api from '@/api/axios';
import {
    ITaskListResponse,
    ITaskDetailResponse,
    TaskStatus,
    TaskPriority,
} from '@/types/task.type.ts';

export interface ICreateTaskPayload {
    title: string;
    description: string;
    department_code: string;
    status: TaskStatus;
    priority: TaskPriority;
    deadline?: string | null;
}

export const TaskService = {
    /**
     * Departament kodi bo'yicha vazifalarni olish.
     * Skrinshotga ko'ra: /tasks/list/?search=DEPT_CODE
     */
    getTasksByDepartment: (deptCode: string) => {
        return api.get<ITaskListResponse>(`/tasks/list/`, {
            params: {
                search: deptCode,
            },
        });
    },

    getAllTasks: () => {
        return api.get<ITaskListResponse>(`/tasks/list/`);
    },

    /**
     * Alohida bitta vazifa tafsilotlarini olish.
     */
    getTaskById: (id: string) => {
        return api.get<ITaskDetailResponse>(`/tasks/detail/${id}/`);
    },

    /**
     * Yangi vazifa yaratish.
     * Senior tip: Odatda status va priority default qiymatga ega bo'ladi,
     * lekin biz ularni qat'iy yuboramiz.
     */
    createTask: (payload: ICreateTaskPayload) => {
        return api.post<ITaskDetailResponse>(`/tasks/create/`, payload);
    },

    /**
     * Vazifani yangilash (Status yoki Priority o'zgarganda kerak bo'ladi)
     */
    updateTask: (id: string, payload: Partial<ICreateTaskPayload>) => {
        return api.patch<ITaskDetailResponse>(`/tasks/update/${id}/`, payload);
    },

    /**
     * Vazifani o'chirish.
     */
    deleteTask: (id: string) => {
        return api.delete(`/tasks/delete/${id}/`);
    },
};
