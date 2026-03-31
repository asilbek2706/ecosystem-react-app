export interface IDepartment {
    id: string;
    code: string;
    name: string;
    is_active: boolean;
    created_at: string;
    created_by: {
        username: string;
    };
    members_count: number;
}

export interface IDepartmentListResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: {
        departments: IDepartment[];
    };
    total_department_count: number;
    timestamp: string;
}
