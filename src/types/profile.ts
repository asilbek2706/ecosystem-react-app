import type { IUserProfile } from './auth.types.ts';
import type { ChangeEvent, FormEvent } from 'react';
import type { IChangePasswordData } from '../services/password.service.ts';

export interface ProfileContextType {
    user: IUserProfile | null;
    refreshProfile: () => Promise<void>;
}

export interface IProfileUpdateForm extends Record<string, string | undefined> {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    telegram_id: string;
}

export interface IGeneralSettingsProps {
    formData: IProfileUpdateForm;
    loading: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: FormEvent) => void;
}

export interface IPasswordSettingsProps {
    formData: IChangePasswordData;
    loading: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: FormEvent) => void;
}
