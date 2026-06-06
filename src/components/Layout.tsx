import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  MessageCircle,
  TrendingUp,
  Gamepad2,
  LogOut,
  Leaf,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Layout = () => {
  const { user, logout } = useAuth(); // ✅ REMOVED setUser
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [editingName, setEditingName] = useState(user?.name || "");

  useEffect(() => {
    setEditingName(user?.name || "");
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 🔐 Name update should be backend-driven (for now only local display)
  const handleNameChange = () => {
    if (!editingName.trim()) return;

    toast({
      title: "Name updated",
      description: `Your name is now ${editingName}`,
    });
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/mood", icon: TrendingUp, label: "Mood Tracker" },
    { path: "/chat", icon: MessageCircle, label: "Chat" },
    { path: "/games", icon: Gamepad2, label: "Games" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-600">
              MindfulMe
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link key={path} to={path}>
                <Button
                  size="sm"
                  variant={isActive(path) ? "default" : "ghost"}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm">
              Welcome, {user?.name || "User"}
            </span>

            {/* Edit name (UI only) */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Name</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button onClick={handleNameChange}>Save</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Logout */}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* MOBILE NAV */}
      <nav className="md:hidden bg-white border-b">
        <div className="flex justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link key={path} to={path}>
              <Button
                size="sm"
                variant={isActive(path) ? "default" : "ghost"}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
