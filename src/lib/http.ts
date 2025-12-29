import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { normalize } from "path";
import { normolizePath } from "./utils";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 402;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: { field: string; message: string }[];
};

export class HttpError extends Error {
  status: number;
  payload: { [key: string]: any };
  constructor({ status, payload }: { status: number; payload: any }) {
    super(payload.message);
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status: 422, payload });
    this.status = status;
    this.payload = payload;
  }
}

class SessionToken {
  private token = "";
  get value() {
    return this.token;
  }
  set value(token: string) {
    //Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("SessionToken can only be set in a browser environment");
    }
    this.token = token;
  }
}

export const clientSessionToken = new SessionToken();
let clientLogoutRequest: null | Promise<any> = null;

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    "Content-Type": "application/json",
    Authorization: clientSessionToken.value
      ? `Bearer ${clientSessionToken.value}`
      : "",
  };

  // Nêu không truyên baseURl hoặc baseUrl là undefined thì lấy từ envConfig
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào mà '' thì là gọi api đến next server
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig?.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });
  const payload: Response = await res.json();
  const data = { status: res.status, payload };
  console.log(data);
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as { status: 422; payload: EntityErrorPayload }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      // console.log("Unauthorized - redirecting to login");
      if (typeof window !== "undefined") {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ force: true }),
            headers: { ...baseHeaders },
          });
          await clientLogoutRequest;
          clientSessionToken.value = "";
          clientLogoutRequest = null;
          location.href = "/login";
        }
      } else {
        const sessionToken = (options?.headers as any).Authorization?.split(
          "Bearer "
        )[1];
        redirect(`/logout?sessionToken=${sessionToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }
  if (typeof window !== "undefined") {
    if (
      ["/auth/login", "/auth/register"].some(
        (item) => item === normolizePath(url)
      )
    ) {
      clientSessionToken.value = (payload as LoginResType)?.data?.token;
    } else if ("/auth/logout" === normolizePath(url)) {
      clientSessionToken.value = "";
    }
  }

  return data;
};

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptions, "body">
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptions, "body">
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptions, "body">
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
