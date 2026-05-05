import { Pill, Activity, Clock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Patients", icon: Pill },
  { to: "/logs", label: "Suivi", icon: Activity },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 glass-card border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Clock className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-foreground">
            MedRemind
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
