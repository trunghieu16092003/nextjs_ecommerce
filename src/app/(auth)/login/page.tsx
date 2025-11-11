"use client";
import React from "react";

import LoginForm from "@/components/authForm/LoginForm";

const Login = () => {
  return (
    <div>
      <h1 className="text-xl font-semibold text-center">Đăng nhập</h1>
      <div className="flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
