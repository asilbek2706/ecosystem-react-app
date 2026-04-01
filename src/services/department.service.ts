import api from '../api/axios';
import type {
    IDepartment,
    IDepartmentListResponse,
} from '../types/department.type.ts';

export const DepartmentService = {
    getAllDepartments: async () => {
        return await api.get<IDepartmentListResponse>('/department/list/');
    },

    getDepartmentById: async (id: string) => {
        return await api.get<{ data: IDepartment }>(`/department/${id}/`);
    },
};
