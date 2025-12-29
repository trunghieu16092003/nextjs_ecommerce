import AuthApiRequests from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res = await request.json();
  const force = res.force as boolean | undefined;
  if (force) {
    return Response.json(
      { message: "Logged out successfully" },
      {
        status: 200,
        headers: {
          "Set-Cookie": `sessionToken=; Path=/; httpOnly; Max-Age=0`,
        },
      }
    );
  }
  const cookiesStore = cookies();
  const sessionToken = cookiesStore.get("sessionToken")?.value;
  if (!sessionToken) {
    return Response.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const result = await AuthApiRequests.logoutFromNextServerToServer(
      sessionToken
    );
    return Response.json(result.payload, {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=; Path=/; httpOnly; Max-Age=0`,
      },
    });
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
