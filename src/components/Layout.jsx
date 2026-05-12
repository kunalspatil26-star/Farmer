import { Link } from 'react-router-dom';
import { Moon, Sun, Home, Tag, ClipboardList, User, Settings2 } from 'lucide-react';
import MobileNav from './MobileNav.jsx';

export default function Layout({ children, user, role, darkMode, toggleTheme }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 border-b border-farmsoil dark:border-slate-700 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl text-farmgreen">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-farmgreen text-white">F</span>
            <span>FarmPrice India</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-farmsoil bg-white text-farmgreen shadow-sm transition hover:bg-farmgreen hover:text-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold">{user.name}</span>
              <span className="text-xs text-farmgray">{role === 'farmer' ? 'Farmer / Seller' : role === 'buyer' ? 'Buyer' : role === 'admin' ? 'Admin' : 'Staff'}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-transparent px-4 py-5 sm:px-6">
        <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white/90 p-4 shadow-lg shadow-farmgreen/5 dark:bg-slate-900/95 dark:shadow-slate-950/20 sm:p-6">
          {children}
        </div>
      </main>

      <footer className="sm:hidden">
        <MobileNav />
      </footer>
    </div>
  );
}
