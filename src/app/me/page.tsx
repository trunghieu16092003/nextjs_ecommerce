import { cookies } from "next/headers";
import React, { useEffect } from "react";
import accountApiRequests from "@/apiRequests/account";
import ProfileForm from "@/components/profileForm/ProfileForm";

export default async function profile() {
  const cookiesStore = cookies();
  const sessionToken = cookiesStore.get("sessionToken")?.value;

  // Vì dùng cookies nên api này ko được cached trên server
  const result = await accountApiRequests.me(sessionToken || "");
  return (
    <div>
      <h1>xin chào</h1>
      <span>Chào mừng {result.payload.data.name}</span>
      <ProfileForm profile={result.payload.data} />
    </div>
  );
}
