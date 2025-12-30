import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast.error(error.payload.message || "Đã có lỗi xảy ra");
  }
};

// Xóa đi kí tự'/ 'ở đầu path nếu có

export const normolizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};
export const decodeJWT = <Payload = any>(token: string) => {
  return jwt.decode(token) as Payload;
};
