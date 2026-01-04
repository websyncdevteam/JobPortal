import React, { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const AdminUserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_END_POINT}/users/${id}`, {
        withCredentials: true,
      });
      setUser(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch user profile");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await axios.post(
        `${ADMIN_API_END_POINT}/users/${id}/notes`,
        { note: newNote },
        { withCredentials: true }
      );
      toast.success("Note added");
      setNewNote("");
      setUser((prev) => ({ ...prev, adminNotes: res.data.notes }));
    } catch (err) {
      toast.error("Failed to add note");
    }
  };

  const handleEditNote = async () => {
    try {
      const res = await axios.put(
        `${ADMIN_API_END_POINT}/users/${id}/notes/${editingNote._id}`,
        { note: editingNote.note },
        { withCredentials: true }
      );
      toast.success("Note updated");
      setEditingNote(null);
      setUser((prev) => ({ ...prev, adminNotes: res.data.notes }));
    } catch (err) {
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await axios.delete(
        `${ADMIN_API_END_POINT}/users/${id}/notes/${noteId}`,
        { withCredentials: true }
      );
      toast.success("Note deleted");
      setUser((prev) => ({ ...prev, adminNotes: res.data.notes }));
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <p><strong>Name:</strong> {user.fullname}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phoneNumber}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <h2 className="text-xl mt-6 mb-2 font-semibold">Admin Notes</h2>

      <Textarea
        placeholder="Add a new note..."
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        className="mb-2"
      />
      <Button onClick={handleAddNote}>Add Note</Button>

      <div className="mt-4 space-y-3">
        {user.adminNotes?.map((note) => (
          <div key={note._id} className="border rounded p-3">
            <p>{note.note}</p>
            <p className="text-xs text-gray-500 mt-1">
              Added by {note.addedBy?.fullname || "Admin"} on{" "}
              {new Date(note.createdAt).toLocaleString()}
              {note.updatedAt && ` • Updated on ${new Date(note.updatedAt).toLocaleString()}`}
            </p>
            <div className="mt-2 space-x-2">
              <Button size="sm" onClick={() => setEditingNote(note)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDeleteNote(note._id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingNote && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-semibold mb-2">Edit Note</h3>
            <Textarea
              value={editingNote.note}
              onChange={(e) =>
                setEditingNote((prev) => ({ ...prev, note: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setEditingNote(null)} variant="outline">Cancel</Button>
              <Button onClick={handleEditNote}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserProfile;
