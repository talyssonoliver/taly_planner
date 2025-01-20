import type { NextApiRequest, NextApiResponse } from "next";
import type { GoogleProfile } from "next-auth/providers/google";
import type { TokenSetParameters } from "openid-client";
import type { Account } from "next-auth";

interface User {
  avatar_url: string;
  username: string;
}
export default function authHandler(req: NextApiRequest, res: NextApiResponse) {
  return {
    providers: [
      {
        id: "google",
        name: "Google",
        type: "oauth" as const,
        version: "2.0",
        scope:
          "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        params: { grant_type: "authorization_code" },
        accessTokenUrl: "https://accounts.google.com/o/oauth2/token",
        requestTokenUrl: "https://accounts.google.com/o/oauth2/auth",
        authorizationUrl:
          "https://accounts.google.com/o/oauth2/auth?response_type=code",
        profileUrl: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        profile: (profile: GoogleProfile, tokens: TokenSetParameters): User => {
          return {
            avatar_url: profile.picture,
            username: profile.email,
            ...tokens,
            ...profile,
          };
        },
      },
    ],
    callbacks: {
      async signIn({ account }: { account: Account }) {
        if (account.provider === "google") {
          return true;
        }
        return false;
      },
    },
  };
}
