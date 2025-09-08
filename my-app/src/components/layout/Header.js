// src/components/layout/Header.jsx
export default function Header({ user }) {
  return (
    <header className="sticky top-0 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 z-30">
      <div className="flex items-center justify-end h-16 px-4 md:px-8">
        <div className="flex items-center">
          <div className="text-right mr-3 hidden sm:block">
            <p className="font-semibold text-white">{user.name}</p>
            <p className="text-xs text-gray-400">{user.role?.name || 'No Role'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}