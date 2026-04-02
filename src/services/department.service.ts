import api from '@/api/axios';
import type {
    IDepartment,
    IDepartmentListResponse,
} from '@/types/department.type.ts';

export const DepartmentService = {
    getAllDepartments: async () => {
        return await api.get<IDepartmentListResponse>('/department/list/');
    },

    getDepartmentById: async (id: string) => {
        return await api.get<{ status: boolean; data: IDepartment }>(
            `/department/detail/${id}/`
        );
    },

    searchDepartment: async (code: string) => {
        return await api.get<IDepartmentListResponse>('/department/list/', {
            params: { search: code },
        });
    },
};
