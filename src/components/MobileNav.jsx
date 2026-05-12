import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Inbox, Layers, User } from 'lucide-react';

const items = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/marketplace', label: 'Market', icon: ShoppingBag },
  { path: '/offers', label: 'Offers', icon: Inbox },
  { path: '/orders', label: 'Orders', icon: Layers },
  { path: '/profile', label: 'Profile', icon: User }
];

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-farmsoil bg-white/95 px-3 py-2 shadow-xl shadow-farmsoil/20 backdrop-blur-md dark:border-slate-700 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                  isActive ? 'bg-farmgreen text-white' : 'text-farmgray hover:bg-farmsoil hover:text-farmgreen'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
