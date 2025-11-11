"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { en } from "zod/locales";
import envConfig from "@/config";
import { stat } from "fs";

const LoginForm = () => {
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    try {
      const result = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
        {
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      ).then(async (res) => {
        const payload = await res.json();
        const data = { status: res.status, payload };
        if (!res.ok) {
          throw data;
        }
        return data;
      });
      console.log(result);
    } catch (error: any) {
      const errors = error.payload.errors as {
        field: string;
        message: string;
      }[];

      const status = error.status as number;
      if (status === 422) {
        errors.forEach((err) => {
          form.setError(err.field as keyof LoginBodyType, {
            type: "server",
            message: err.message,
          });
        });
      } else {
        toast.error(error.payload.message || "Đã có lỗi xảy ra");
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 max-w-[600px] w-full"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="!mt-8  w-full">
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
