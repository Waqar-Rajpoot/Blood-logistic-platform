import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const getDatatFromToken = async (request: NextRequest) => {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      console.log("No token found");
      throw new Error("Unauthenticated");
    }

    return token.id;
  } catch (error: any) {
    throw new Error(error.message || "Token decoding failed");
  }
};
