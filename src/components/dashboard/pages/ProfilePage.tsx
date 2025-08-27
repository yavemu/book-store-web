import { UserProfileResponseDto } from '@/types/auth';

interface ProfilePageProps {
  user?: UserProfileResponseDto | null;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
    </div>
  );
}