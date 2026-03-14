import { type FC } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { IUserProfile } from '../types/auth.types.ts';
import ProfileView from './dashboard/ProfileView.tsx';

const ProfilePage: FC = () => {
    const { user } = useOutletContext<{ user: IUserProfile | null }>();
    return <ProfileView user={user} />;
};

export default ProfilePage;
