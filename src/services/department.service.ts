import api from '../api/axios';
import type { IDepartment } from '../types/department.type.ts';

export const DepartmentService = {
    getAllDepartments: async () => {
        return await api.get<IDepartment[]>('/department/list/');
    },

    getDepartmentById: async (id: string) => {
        return await api.get<IDepartment>(`/department/${id}/`);
    },
};
