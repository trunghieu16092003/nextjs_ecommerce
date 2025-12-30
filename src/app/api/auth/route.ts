export async function POST(request: Request) {
  const body = await request.json();
  const sessionToken = body.sessionToken as string;
  const expiresAt = body.expiresAt as string;
  if (!sessionToken) {
    return Response.json({ message: "No token provided" }, { status: 400 });
  }

  const expireDate = new Date(expiresAt).toUTCString();

  return Response.json(
    { body },
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=${sessionToken}; Path=/; httpOnly; Expires=${expireDate}; SameSite=Lax; Secure`,
      },
    }
  );
}
