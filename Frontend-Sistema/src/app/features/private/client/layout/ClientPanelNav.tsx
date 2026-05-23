import { NavLink } from "react-router-dom";
import { CLIENT_NAV_ITEMS } from "../clientNav";

export default function ClientPanelNav() {
  return (
    <nav
      className="border-b border-slate-100 bg-white px-4 sm:px-6 lg:px-8"
      aria-label="Secciones del panel cliente"
    >
      <ul className="mx-auto flex max-w-7xl justify-center gap-1 overflow-x-auto pb-0 sm:gap-2">
        {CLIENT_NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <li key={path} className="shrink-0">
            <NavLink
              to={path}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3.5 text-sm font-medium transition sm:px-4 ${
                  isActive
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-700"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
