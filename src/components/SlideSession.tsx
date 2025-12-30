"use client";

import React, { useEffect } from "react";
import AuthApiRequests from "@/apiRequests/auth";
import { clientSessionToken } from "@/lib/http";
import { differenceInHours } from "date-fns";

export default function SlideSession() {
  const slideSession = async () => {
    const res = await AuthApiRequests.slideSessionFromClient();
    clientSessionToken.expiresAt = res.payload.data.expiresAt;
  };
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const expiresAt = new Date(clientSessionToken.expiresAt);
      if (differenceInHours(expiresAt, now) < 1) {
        slideSession();
      }
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
