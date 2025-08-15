"use client";

import React, { useEffect, useState } from "react";
import Card from "./Card";
import { User } from "@/interfaces/userInterface";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import { CirclePlus } from "lucide-react";

interface UserInterfaceProps {
  backendName: string;
}

const UserInterface = ({ backendName }: UserInterfaceProps) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [users, setUsers] = useState<User[]>([]);
  const [newUsers, setNewUsers] = useState({ name: "", email: "" });
  const [updateUser, setUpdateUser] = useState({ id: "", name: "", email: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/${backendName}/users`);
        setUsers(res.data.reverse());
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [apiUrl, backendName]);

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${apiUrl}/api/${backendName}/users`,
        newUsers
      );
      setUsers([res.data, ...users]);
      setNewUsers({ name: "", email: "" });
      toast.success("User created successfully!");
    } catch (error) {
      console.log("Error creating user:", error);
    }
  };

  const handleUpdateUsers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${apiUrl}/api/${backendName}/users/${updateUser.id}`,
        {
          name: updateUser.name,
          email: updateUser.email,
        }
      );
      setUsers(
        users.map((user) => (user.id === res.data.id ? res.data : user))
      );
      setUpdateUser({ id: "", name: "", email: "" });
      toast.success("User updated successfully!");
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`${apiUrl}/api/${backendName}/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  return (
    <div className={`p-6 bg-black min-h-screen text-white ${backendName}`}>
      {/* Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="mb-3 rounded-xl"
        />
        <h1 className="uppercase tracking-wider font-extrabold text-3xl md:text-4xl">
          Golang User Management
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage users with ease</p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="bg-neutral-900 p-6 rounded-lg shadow-md border border-neutral-800 hover:border-[#00ADD8] transition">
          <div className="flex items-center gap-2 mb-6">
            <CirclePlus className="text-[#00ADD8]" size={22} />
            <h2 className="text-xl font-bold">Add New User</h2>
          </div>

          <form onSubmit={createUser} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={newUsers.name}
              onChange={(e) =>
                setNewUsers({ ...newUsers, name: e.target.value })
              }
              className="w-full border border-neutral-700 bg-black p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADD8] transition"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUsers.email}
              onChange={(e) =>
                setNewUsers({ ...newUsers, email: e.target.value })
              }
              className="w-full border border-neutral-700 bg-black p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADD8] transition"
            />
            <button
              type="submit"
              className="w-full bg-[#00ADD8] hover:bg-[#009FC8] text-black px-4 py-3 rounded-md font-semibold text-sm transition-all"
            >
              + Create User
            </button>
          </form>

          <form onSubmit={handleUpdateUsers} className="space-y-4 mt-8">
            <input
              type="text"
              placeholder="Name"
              value={updateUser.name}
              onChange={(e) =>
                setUpdateUser({ ...updateUser, name: e.target.value })
              }
              className="w-full border border-neutral-700 bg-black p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADD8] transition"
            />
            <input
              type="email"
              placeholder="Email"
              value={updateUser.email}
              onChange={(e) =>
                setUpdateUser({ ...updateUser, email: e.target.value })
              }
              className="w-full border border-neutral-700 bg-black p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADD8] transition"
            />
            <input
              type="text"
              placeholder="UserID"
              value={updateUser.id}
              onChange={(e) =>
                setUpdateUser({ ...updateUser, id: e.target.value })
              }
              className="w-full border border-neutral-700 bg-black p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADD8] transition"
            />

            <button
              type="submit"
              className="w-full bg-[#00ADD8] hover:bg-[#009FC8] text-black px-4 py-3 rounded-md font-semibold text-sm transition-all"
            >
              + Update User
            </button>
          </form>
        </div>

        {/* Right Column - User List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-neutral-900 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-neutral-800 hover:border-[#00ADD8] transition"
              >
                <Card user={user} />
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInterface;
