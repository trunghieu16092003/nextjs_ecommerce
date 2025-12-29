"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clientSessionToken } from "@/lib/http";
import AuthApiRequests from "@/apiRequests/auth";

export default function page() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const sessionToken = searchParams.get("sessionToken");
  useEffect(() => {
    if (sessionToken === clientSessionToken?.value) {
      AuthApiRequests.logoutFromClient(true).then(() => {
        router.push(`/login?redirectFrom=${pathName}`);
      });
    }
  }, [sessionToken, router, pathName]);
  return <div>page</div>;
}
