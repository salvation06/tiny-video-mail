import { Link, useLocation } from "react-router-dom";
import { Play, Inbox, Send, Upload, LogOut, User, Users, Mail } from "lucide-react";
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
    { path: "/inbox", icon: Inbox, label: "Inbox" },
    { path: "/compose", icon: Send, label: "Send to User" },
    { path: "/email", icon: Mail, label: "Send via Email" },
    { path: "/contacts", icon: Users, label: "Contacts" },
    { path: "/upload", icon: Upload, label: "Upload" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-white/10 p-4 flex flex-col">
      <Link to="/inbox" className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Play size={16} fill="white" />
        </div>
        <span className="text-xl font-bold text-white">TinyBot</span>
      </Link>

      <Button
        asChild
        className="w-full mb-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
        {username && (
          <div className="flex items-center gap-2 px-4 py-2 text-gray-400">
            <User className="h-4 w-4" />
            <span className="text-sm">@{username}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
