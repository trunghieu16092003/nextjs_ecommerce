import React from "react";

import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import Logout from "./Logout";
import { AccountResType } from "@/schemaValidations/account.schema";
const Header = async ({ user }: { user: AccountResType["data"] | null }) => {
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
