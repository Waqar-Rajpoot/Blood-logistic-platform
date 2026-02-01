import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

// Extend the built-in types for TypeScript safety
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAvailable: boolean;
      role: string;
      username: string;
      location?: {
        type: string;
        coordinates: [number, number];
      };
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    isAvailable: boolean;
    role: string;
    username: string;
    location?: {
      type: string;
      coordinates: [number, number];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAvailable: boolean;
    role: string;
    location?: {
      type: string;
      coordinates: [number, number];
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Please enter email or username and password");
        }

        try {
          await connect();

          const user = await User.findOne({
            $or: [
              { email: credentials.identifier.toLowerCase() },
              { username: credentials.identifier },
            ],
          });

          if (!user) throw new Error("Invalid credentials");

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) throw new Error("Invalid credentials");

          if (!user.isVerified) {
            throw new Error("Please wait for admin to verify your account");
          }

          // 1. Pass the location object from the DB to the return object
          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            isAvailable: user.isAvailable,
            role: user.role,
            location: user.location, // Added this
          };
        } catch (err: any) {
          throw new Error(err.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 2. Transfer location from the user object to the JWT token
      if (user) {
        token.id = user.id;
        token.isAvailable = user.isAvailable;
        token.role = user.role;
        token.location = user.location; 
      }
      return token;
    },
    async session({ session, token }) {
      // 3. Transfer location from the token to the session object
      if (session.user) {
        session.user.id = token.id;
        session.user.isAvailable = token.isAvailable;
        session.user.role = token.role;
        session.user.location = token.location;
      }
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