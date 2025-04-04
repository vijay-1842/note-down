import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearToken } from '@/lib/authSlice';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearToken());
    router.replace("/signin");
  }

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white shadow-md">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold">NoteDown</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-white border-white border p-1 cursor-pointer" onClick={() => handleLogout()}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
