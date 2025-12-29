"use client";
import React from "react";

import { Button } from "./ui/button";
import AuthApiRequests from "@/apiRequests/auth";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";

export default function Logout() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await AuthApiRequests.logoutFromClient();
      router.push("/login");
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <Button size={"sm"} onClick={handleLogout}>
      Đăng xuất
    </Button>
  );
}
