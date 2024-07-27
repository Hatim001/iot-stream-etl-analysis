import { NextAuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER,
      idToken: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.token = token.idToken;
      return session;
    },
  },
};
