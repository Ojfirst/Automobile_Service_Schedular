"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RoleType } from "@/prisma.db";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface RolesTabProps { }

export default function RolesTab({ }: RolesTabProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        console.error(err, 'Failed to fetch user')
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        toast.success("Role updated");
      } else {
        toast.error("Failed to update role");
      }
    } catch {
      toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && <p className="text-gray-400">Loading...</p>}

      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-800/50">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-800 text-gray-200">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b text-gray-400 border-gray-800 hover:bg-gray-800/30"
              >
                <td className="p-4">{user.name || "N/A"}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value)
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-gray-300"
                  >
                    <option value="ADMIN">ADMIN</option>
                    {Object.values(RoleType).map((role) =>
                      role !== 'ADMIN' ? (
                        <option key={role} value={role}>{role}</option>
                      ) : null
                    )}

                  </select>
                </td>
                <td className="p-4">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    onClick={() => handleRoleChange(user.id, user.role)}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
