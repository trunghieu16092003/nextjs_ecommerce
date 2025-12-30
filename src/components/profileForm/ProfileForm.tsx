"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";

import AuthApiRequests from "@/apiRequests/auth";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import {
  AccountResType,
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import accountApiRequests from "@/apiRequests/account";

type Profile = AccountResType["data"];

const ProfileForm = ({ profile }: { profile: Profile }) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: profile.name || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: UpdateMeBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      await accountApiRequests.updateMe(values);
      router.refresh();
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError, duration: 5000 });
    } finally {
      setLoading(false);
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
          render={() => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email"
                  type="email"
                  value={profile.email}
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ tên</FormLabel>
              <FormControl>
                <Input placeholder="tên" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="!mt-8  w-full">
          Cập nhật
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
