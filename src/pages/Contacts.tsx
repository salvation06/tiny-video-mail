import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { Users, Plus, Pencil, Trash2, Upload, Search, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { z } from "zod";

interface Contact {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

const emailSchema = z.string().email("Invalid email address");

const Contacts = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [username, setUsername] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [importText, setImportText] = useState("");
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
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Failed to load contacts");
      console.error(error);
    } else {
      setContacts(data || []);
    }
  };

  const handleAddContact = async () => {
    try {
      emailSchema.parse(newEmail);
    } catch (error) {
      toast.error("Invalid email address");
      return;
    }

    const { error } = await supabase.from("contacts").insert({
      user_id: session?.user?.id,
      email: newEmail.toLowerCase().trim(),
      name: newName.trim() || null,
    });

    if (error) {
      if (error.code === "23505") {
        toast.error("This contact already exists");
      } else {
        toast.error("Failed to add contact");
        console.error(error);
      }
    } else {
      toast.success("Contact added");
      setNewEmail("");
      setNewName("");
      setIsAddDialogOpen(false);
      fetchContacts();
    }
  };

  const handleUpdateContact = async () => {
    if (!editingContact) return;

    try {
      emailSchema.parse(newEmail);
    } catch (error) {
      toast.error("Invalid email address");
      return;
    }

    const { error } = await supabase
      .from("contacts")
      .update({
        email: newEmail.toLowerCase().trim(),
        name: newName.trim() || null,
      })
      .eq("id", editingContact.id);

    if (error) {
      toast.error("Failed to update contact");
      console.error(error);
    } else {
      toast.success("Contact updated");
      setEditingContact(null);
      setNewEmail("");
      setNewName("");
      fetchContacts();
    }
  };

  const handleDeleteContact = async (id: string) => {
    const { error } = await supabase.from("contacts").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete contact");
      console.error(error);
    } else {
      toast.success("Contact deleted");
      fetchContacts();
    }
  };

  const handleImportContacts = async () => {
    const lines = importText.split("\n").filter((line) => line.trim());
    let imported = 0;
    let failed = 0;

    for (const line of lines) {
      const parts = line.split(",").map((p) => p.trim());
      const email = parts[0];
      const name = parts[1] || null;

      try {
        emailSchema.parse(email);
        const { error } = await supabase.from("contacts").insert({
          user_id: session?.user?.id,
          email: email.toLowerCase(),
          name,
        });
        if (!error) {
          imported++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    toast.success(`Imported ${imported} contacts${failed > 0 ? `, ${failed} failed` : ""}`);
    setImportText("");
    setIsImportDialogOpen(false);
    fetchContacts();
  };

  const startEdit = (contact: Contact) => {
    setEditingContact(contact);
    setNewEmail(contact.email);
    setNewName(contact.name || "");
  };

  const cancelEdit = () => {
    setEditingContact(null);
    setNewEmail("");
    setNewName("");
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <div className="max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold">Contacts</h1>
            </div>
            <div className="flex gap-3">
              <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-white/10 bg-white/5 text-gray-300 hover:bg-white/10">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle>Import Contacts</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <p className="text-sm text-gray-400">
                      Paste contacts in CSV format: email,name (one per line)
                    </p>
                    <textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="john@example.com,John Doe&#10;jane@example.com,Jane Smith"
                      className="w-full h-40 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                    />
                    <Button
                      onClick={handleImportContacts}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Import Contacts
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Email</Label>
                      <Input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Name (optional)</Label>
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="John Doe"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
                      />
                    </div>
                    <Button
                      onClick={handleAddContact}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Add Contact
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 rounded-full"
            />
          </div>

          {/* Contacts List */}
          <div className="space-y-2">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchQuery ? "No contacts found" : "No contacts yet. Add your first contact!"}
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition"
                >
                  {editingContact?.id === contact.id ? (
                    <div className="flex-1 flex items-center gap-3">
                      <Input
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="flex-1 bg-white/5 border-white/10 text-white"
                        placeholder="Email"
                      />
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 bg-white/5 border-white/10 text-white"
                        placeholder="Name"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleUpdateContact}
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={cancelEdit}
                        className="text-gray-400 hover:text-gray-300 hover:bg-white/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-medium text-white">
                          {contact.name || contact.email}
                        </p>
                        {contact.name && (
                          <p className="text-sm text-gray-400">{contact.email}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(contact)}
                          className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contacts;
