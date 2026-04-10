export interface IDepartment {
    id: string; // UUID formatida keladi
    code: string;
    name: string;
    is_active: boolean;
    created_at: string;
    created_by: {
        username: string;
        first_name?: string;
        last_name?: string;
    };
    members_count: string;
}

export interface IDepartmentListResponse {
    status?: boolean;
    statusCode?: number;
    message?: string;
    data?: {
        departments?: IDepartment[];
    };
    total_department_count?: number;
    timestamp?: string;
}
