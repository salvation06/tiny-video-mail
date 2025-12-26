import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Video, Send, Search, X, Paperclip, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
}

const Compose = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Profile | null>(null);
  const [messageText, setMessageText] = useState("");
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setSearching(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name")
        .ilike("username", `%${searchQuery}%`)
        .limit(5);

      if (error) {
        console.error("Search error:", error);
      } else {
        setSearchResults(data || []);
      }
      setSearching(false);
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelectRecipient = (profile: Profile) => {
    setSelectedRecipient(profile);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRecipient) {
      toast.error("Please select a recipient");
      return;
    }

    if (!filename.trim()) {
      toast.error("Please attach a video file");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!senderProfile) {
        toast.error("Profile not found");
        return;
      }

      const { error } = await supabase.from("video_messages").insert({
        sender_id: senderProfile.id,
        recipient_id: selectedRecipient.id,
        filename: filename,
        file_path: `/videos/${filename}`, // Placeholder path
        message_text: messageText || null,
        file_size_mb: Math.random() * 50, // Placeholder
      });

      if (error) {
        toast.error("Failed to send message");
        console.error(error);
      } else {
        toast.success(`Video sent to @${selectedRecipient.username}`);
        navigate("/");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Inbox
        </Link>

        <Card className="border-2 border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Video className="h-5 w-5 text-primary" />
              New Video Message
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipient Search */}
              <div className="space-y-2">
                <Label className="text-foreground">To</Label>
                {selectedRecipient ? (
                  <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
                    <span className="text-primary font-medium">@{selectedRecipient.username}</span>
                    <span className="text-muted-foreground">{selectedRecipient.display_name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedRecipient(null)}
                      className="ml-auto text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search for a user..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border-2 border-border rounded-lg overflow-hidden z-10">
                        {searchResults.map((profile) => (
                          <button
                            key={profile.id}
                            type="button"
                            onClick={() => handleSelectRecipient(profile)}
                            className="w-full px-4 py-3 text-left hover:bg-secondary flex items-center gap-2 border-b border-border last:border-0"
                          >
                            <span className="text-primary font-medium">@{profile.username}</span>
                            {profile.display_name && (
                              <span className="text-muted-foreground">{profile.display_name}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    {searching && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border-2 border-border rounded-lg p-3 text-center text-muted-foreground">
                        Searching...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Video Attachment */}
              <div className="space-y-2">
                <Label className="text-foreground">Video Attachment</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="video_filename.mp4"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="border-border text-foreground hover:bg-secondary"
                  >
                    <Link to="/upload">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Upload
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Max 50MB • Video will be deleted after viewing
                </p>
              </div>

              {/* Message Text */}
              <div className="space-y-2">
                <Label className="text-foreground">Message (optional)</Label>
                <Textarea
                  placeholder="Add a message to go with your video..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="min-h-[120px] bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {messageText.length}/500
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading || !selectedRecipient || !filename.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? "Sending..." : "Send Video"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Compose;
