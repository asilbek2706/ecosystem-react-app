export interface ITask {
    id: string;
    title: string;
    description: string;
    department_code: string;
    status: string;
    priority: string;
    created_by: {
        username: string;
    };
    deadline: string | null;
    created_at: string;
}

export interface ITaskDetailResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: ITask;
    timestamp: string;
}
