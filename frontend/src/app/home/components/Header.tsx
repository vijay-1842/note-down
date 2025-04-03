const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white shadow-md">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold">NoteDown</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-white border-white border p-1 cursor-pointer">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
