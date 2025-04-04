import { useAppDispatch } from "@/hooks/useAppDispatch";
import { clearToken } from "@/lib/authSlice";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearToken());
    router.replace("/signin");
  };

  return (
    <header className="px-4 py-4 bg-gradient-to-br from-purple-800 via-purple-600 to-purple-700 text-white shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">NoteDown</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="text-white font-bold font-small border-white rounded-xl hover:rounded-md px-4 py-1 cursor-pointer transition duration-200 border-2"
            onClick={() => handleLogout()}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
