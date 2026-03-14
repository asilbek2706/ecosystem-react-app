export interface IDepartment {
    id: string;
    code: string;
    name: string;
}

export interface IUserProfile {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    telegram_id: string;
    profile_image_url: string;
    role: string;
    date_joined: string;
    last_login: string;
    is_2fa_enabled: boolean;
    github_username: string;
    member_departments: IDepartment[];
}
