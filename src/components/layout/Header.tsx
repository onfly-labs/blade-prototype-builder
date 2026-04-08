import { Globe, HelpCircle, Rocket, Bell, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Reservas", path: "/" },
  { label: "Aprovações Automáticas", path: "/aprovacoes-automaticas" },
  { label: "Relatórios", path: "/relatorios" },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-2xl font-extrabold text-primary tracking-tight">onfly</span>
          <Globe className="w-6 h-6 text-primary" />
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <HelpCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Ajuda</span>
        </button>
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Rocket className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">5</span>
        </button>
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};

export default Header;
