import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Sidebar from "@/components/Sidebar";
import MessageCard from "@/components/MessageCard";
import EmptyInbox from "@/components/EmptyInbox";
import { toast } from "sonner";
import { Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoMessage {
  id: string;
  filename: string;
  file_path: string;
  file_size_mb: number | null;
  message_text: string | null;
  sent_at: string;
  sender: {
    username: string;
    display_name: string | null;
  };
}

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<VideoMessage[]>([]);
  const [username, setUsername] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
      fetchMessages();
    }
  }, [session]);

  const fetchProfile = async () => {
    if (!session?.user) return;

    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", session.user.id)
      .single();

    if (data) {
      setUsername(data.username);
    }
  };

  const fetchMessages = async () => {
    if (!session?.user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    if (!profile) return;

    const { data, error } = await supabase
      .from("video_messages")
      .select(`
        id,
        filename,
        file_path,
        file_size_mb,
        message_text,
        sent_at,
        sender:sender_id (
          username,
          display_name
        )
      `)
      .eq("recipient_id", profile.id)
      .eq("is_deleted", false)
      .is("viewed_at", null)
      .order("sent_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      // Type assertion to handle the nested sender object
      const typedMessages = (data || []).map(msg => ({
        ...msg,
        sender: msg.sender as unknown as { username: string; display_name: string | null }
      }));
      setMessages(typedMessages);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
    toast.success("Inbox refreshed");
  };

  const handleView = async (id: string) => {
    // Mark as viewed
    await supabase
      .from("video_messages")
      .update({ viewed_at: new Date().toISOString() })
      .eq("id", id);

    // In production, this would open the video player
    toast.success("Video marked as viewed - would play in production");
    fetchMessages();
  };

  const handleDownload = async (id: string) => {
    await supabase
      .from("video_messages")
      .update({ downloaded_at: new Date().toISOString() })
      .eq("id", id);

    toast.success("Video downloaded - marked for deletion");
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    await supabase
      .from("video_messages")
      .update({ is_deleted: true })
      .eq("id", id);

    toast.success("Video deleted");
    fetchMessages();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar username={username} />
      
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 bg-background/95 backdrop-blur border-b-2 border-border p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Inbox</h1>
            {messages.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {messages.length}
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-border text-foreground hover:bg-secondary"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </header>

        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <EmptyInbox />
          ) : (
            messages.map((message) => (
              <MessageCard
                key={message.id}
                id={message.id}
                senderUsername={message.sender.username}
                senderDisplayName={message.sender.display_name}
                filename={message.filename}
                messageText={message.message_text}
                sentAt={message.sent_at}
                fileSizeMb={message.file_size_mb}
                onView={handleView}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
