"use client";
import { User } from "@/interfaces/userInterface";
import React from "react";
import { UserIcon, Mail } from "lucide-react";

const Card = ({ user }: { user: User }) => {
  return (
    <div className="bg-neutral-900 rounded-lg p-6 shadow-md text-white flex flex-col gap-4 border border-neutral-800 hover:border-[#00ADD8] transition-all">
      <div className="flex items-center  gap-3">
        <UserIcon size={24} className="text-[#00ADD8]" />
        <h2 className="text-lg font-bold">{user.name}</h2>
      </div>
      <div className="flex items-center gap-3 text-gray-300">
        <Mail size={20} className="text-[#00ADD8]" />
        <p className="text-base">{user.email}</p>
      </div>
      <p className="text-base font-bold ">UserID: {user.id}</p>
    </div>
  );
};

export default Card;
