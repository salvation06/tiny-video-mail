import { Link, useLocation } from "react-router-dom";
import { Video, Inbox, Send, Upload, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SidebarProps {
  username?: string;
}

const Sidebar = ({ username }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  const navItems = [
    { path: "/", icon: Inbox, label: "Inbox" },
    { path: "/compose", icon: Send, label: "Compose" },
    { path: "/upload", icon: Upload, label: "Upload" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r-2 border-border p-4 flex flex-col">
      <Link to="/" className="flex items-center gap-2 mb-8 px-2">
        <Video className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-foreground">TinyBot</span>
      </Link>

      <Button
        asChild
        className="w-full mb-6 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Link to="/compose">
          <Send className="h-4 w-4 mr-2" />
          New Message
        </Link>
      </Button>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === path
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-border pt-4 mt-4 space-y-2">
        {username && (
          <div className="flex items-center gap-2 px-4 py-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="text-sm">@{username}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
