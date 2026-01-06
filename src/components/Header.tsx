import React from "react";

import Link from "next/link";
import { cookies } from "next/headers";

import { ModeToggle } from "./mode-toggle";
import Logout from "./Logout";
import accountApiRequests from "@/apiRequests/account";
const Header = async () => {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;
  let user = null;
  if (sessionToken) {
    const data = await accountApiRequests.me(sessionToken);
    user = data.payload.data;
  }

  console.log("user", user);

  return (
    <div>
      <ul>
        <li>
          <Link href="/products">Danh sách sản phẩm</Link>
        </li>
        {user ? (
          <li>
            <Logout />
          </li>
        ) : (
          <>
            <li>
              <Link href="/login">Đăng nhập</Link>
            </li>
            <li>
              <Link href="/register">Đăng ký</Link>
            </li>
          </>
        )}
      </ul>
      <ModeToggle />
    </div>
  );
};

export default Header;
