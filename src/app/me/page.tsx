import { cookies } from "next/headers";
import React, { useEffect } from "react";
import accountApiRequests from "@/apiRequests/account";

export default async function profile() {
  const cookiesStore = cookies();
  const sessionToken = cookiesStore.get("sessionToken")?.value;
  const result = await accountApiRequests.me(sessionToken || "");
  return (
    <div>
      <h1>xin chào</h1>
      <span>Chào mừng {result.payload.data.name}</span>
    </div>
  );
}
