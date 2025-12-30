import AuthApiRequests from "@/apiRequests/auth";
import { cookies } from "next/headers";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
    const cookieStore = cookies();

  const sessionToken = cookieStore.get("sessionToken")?.value;
  if (!sessionToken) {
    return Response.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const res = await AuthApiRequests.slideSessionFromNextServerToServer(sessionToken);
    const newExpiresDate = new Date(res.payload.data.expiresAt).toUTCString();

    return Response.json(
    res.payload ,
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=${sessionToken}; Path=/; httpOnly; Expires=${newExpiresDate}; SameSite=Lax; Secure`,
      },
    }
  );
  } catch (error) {
    if (error instanceof HttpError) {
          return Response.json(error.payload, { status: error.status });
        } else {
          return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
          );
        }
  }
}
