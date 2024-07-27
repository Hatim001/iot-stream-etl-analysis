import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const response = await fetch(`${process.env.BASE_API_URL}/report`, {
    headers: {
      Authorization: `Bearer ${token?.idToken}`,
    },
  });

  const data = await response.json();

  return Response.json({ ...data?.report });
};
