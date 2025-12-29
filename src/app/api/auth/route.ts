import { decodeJWT } from "@/lib/utils";

type PayloadJWT = {
  iat: number;
  exp: number;
  tokenType: string;
  userId: number;
};

export async function POST(request: Request) {
  const res = await request.json();
  const sessionToken = res.sessionToken as string;
  if (!sessionToken) {
    return Response.json({ message: "No token provided" }, { status: 400 });
  }

  const payload = decodeJWT<PayloadJWT>(sessionToken);
  const expireDate = new Date(payload?.exp * 1000).toUTCString();

  return Response.json(
    { res },
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=${sessionToken}; Path=/; httpOnly; Expires=${expireDate}; SameSite=Lax; Secure`,
      },
    }
  );
}
