import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" }, // Changed type to "text"
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Please enter email or username and password");
        }

        try {
          await connect();

          // Find user by either email OR username
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier.toLowerCase() }, // Case-insensitive logic helps here
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            // Security Tip: Generic error messages prevent user enumeration
            throw new Error("Invalid credentials"); 
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }

          if (!user.isVerified) {
            throw new Error("Please wait for admin to verify your account");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username, // Added username to return object
            role: user.role,
          };
        } catch (err: any) {
          // Re-throw the specific error message to be caught by the UI
          throw new Error(err.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id.toString();
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.email = token.email as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
