import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { Mail, Paperclip, Send, X, Plus, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";

interface Contact {
  id: string;
  email: string;
  name: string | null;
}

const emailSchema = z.string().email("Invalid email address");

const EmailCompose = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);
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
      fetchContacts();
    }
  }, [session]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", session?.user?.id)
      .maybeSingle();
    
    if (data) {
      setUsername(data.username);
    }
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from("contacts")
      .select("id, email, name")
      .order("name", { ascending: true });

    if (!error && data) {
      setContacts(data);
    }
  };

  const addRecipient = (email: string) => {
    const trimmedEmail = email.toLowerCase().trim();
    try {
      emailSchema.parse(trimmedEmail);
      if (!recipients.includes(trimmedEmail)) {
        setRecipients([...recipients, trimmedEmail]);
      }
      setNewRecipient("");
      setIsContactsOpen(false);
    } catch {
      toast.error("Invalid email address");
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newRecipient.trim()) {
      e.preventDefault();
      addRecipient(newRecipient);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File must be under 50MB");
        return;
      }
      setAttachment(file);
    }
  };

  const handleSend = async () => {
    if (recipients.length === 0) {
      toast.error("Please add at least one recipient");
      return;
    }

    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }

    setSending(true);

    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(`Email sent to ${recipients.length} recipient${recipients.length > 1 ? "s" : ""}! (Mock)`);
    
    // Clear form
    setRecipients([]);
    setSubject("");
    setMessage("");
    setAttachment(null);
    setSending(false);
  };

  const filteredContacts = contacts.filter(
    (c) =>
      !recipients.includes(c.email) &&
      (c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar username={username} />
      
      <main className="ml-64 p-8">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Mail className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold">Send Video via Email</h1>
          </div>

          {/* Compose Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            {/* Recipients */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">To</label>
              <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-lg min-h-[50px]">
                {recipients.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm"
                  >
                    {email}
                    <button
                      onClick={() => removeRecipient(email)}
                      className="hover:text-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <div className="flex-1 flex items-center gap-2 min-w-[200px]">
                  <Input
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter email or select from contacts..."
                    className="border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 p-0"
                  />
                  <Dialog open={isContactsOpen} onOpenChange={setIsContactsOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-white/10 text-white max-h-[500px]">
                      <DialogHeader>
                        <DialogTitle>Select Contacts</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search contacts..."
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                        <div className="max-h-[300px] overflow-y-auto space-y-1">
                          {filteredContacts.length === 0 ? (
                            <p className="text-center py-4 text-gray-500">
                              {contacts.length === 0
                                ? "No contacts yet"
                                : "No matching contacts"}
                            </p>
                          ) : (
                            filteredContacts.map((contact) => (
                              <button
                                key={contact.id}
                                onClick={() => addRecipient(contact.email)}
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition"
                              >
                                <p className="font-medium">
                                  {contact.name || contact.email}
                                </p>
                                {contact.name && (
                                  <p className="text-sm text-gray-400">
                                    {contact.email}
                                  </p>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Subject</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Video from TinyBot"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>

            {/* Attachment */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Attachment</label>
              {attachment ? (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <Video className="h-6 w-6 text-green-400" />
                  <div className="flex-1">
                    <p className="font-medium text-green-400">{attachment.name}</p>
                    <p className="text-sm text-green-400/70">
                      {(attachment.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setAttachment(null)}
                    className="text-green-400 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-blue-500/50 transition">
                  <Paperclip className="h-6 w-6 text-gray-400" />
                  <span className="text-gray-400">
                    Click to attach a video (max 50MB)
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleAttachmentChange}
                    className="hidden"
                  />
                </label>
              )}
              <p className="text-xs text-gray-500">
                Note: Video will be deleted from TinyBot after sending. Recipients receive it as an email attachment.
              </p>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                rows={5}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={sending || recipients.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-6 text-lg font-semibold"
            >
              {sending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailCompose;
