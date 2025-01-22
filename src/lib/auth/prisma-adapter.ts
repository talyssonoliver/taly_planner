import type { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import type {
	Adapter,
	AdapterUser,
	AdapterSession,
	AdapterAccount,
} from "next-auth/adapters";
import { parseCookies, destroyCookie } from "nookies";
import { prisma } from "../prisma";

export function PrismaAdapter(
	req: NextApiRequest | NextPageContext["req"],
	res: NextApiResponse | NextPageContext["res"],
): Adapter {
	return {
		async createUser(user: Omit<AdapterUser, "id" | "emailVerified">) {
			const { "@taly:userId": userIdOnCookies } = parseCookies({ req });

			if (!userIdOnCookies) {
				throw new Error("User ID not found on cookies.");
			}

			const prismaUser = await prisma.user.upsert({
				where: { id: userIdOnCookies },
				update: {
					name: user.name ?? "",
					email: user.email,
					avatar_url: user.avatar_url,
				},
				create: {
					id: userIdOnCookies,
					name: user.name ?? "",
					email: user.email,
					avatar_url: user.avatar_url,
					username: user.username ?? "",
				},
			});

			destroyCookie({ res }, "@taly:userId", { path: "/" });

			return {
				id: prismaUser.id,
				name: prismaUser.name ?? "",
				email: prismaUser.email ?? "",
				emailVerified: null,
				avatar_url: prismaUser.avatar_url ?? "",
				username: prismaUser.username ?? "", 
			} as AdapterUser;
		},

		async getUser(id: string) {
			const user = await prisma.user.findUnique({ where: { id } });

			if (!user) return null;

			return {
				id: user.id,
				name: user.name ?? "",
				email: user.email ?? "",
				emailVerified: null,
				avatar_url: user.avatar_url ?? "",
			} as AdapterUser;
		},

		async getUserByEmail(email: string) {
			const user = await prisma.user.findUnique({ where: { email } });

			if (!user) return null;

			return {
				id: user.id,
				name: user.name ?? "",
				email: user.email ?? "",
				emailVerified: null,
				avatar_url: user.avatar_url ?? "",
			} as AdapterUser;
		},

		async getUserByAccount({
			providerAccountId,
			provider,
		}: Pick<AdapterAccount, "provider" | "providerAccountId">) {
			const account = await prisma.account.findUnique({
				where: {
					provider_provider_account_id: {
						provider,
						provider_account_id: providerAccountId,
					},
				},
				include: { user: true },
			});

			if (!account) return null;

			const { user } = account;

			return {
				id: user.id,
				name: user.name ?? "",
				email: user.email ?? "",
				emailVerified: null,
				avatar_url: user.avatar_url ?? "",
			} as AdapterUser;
		},

		async updateUser(user: Partial<AdapterUser> & { id: string }) {
			try {
				const prismaUser = await prisma.user.update({
					where: { id: user.id },
					data: {
						name: user.name ?? undefined,
						email: user.email,
						avatar_url: user.avatar_url,
					},
				});

				return {
					id: prismaUser.id,
					name: prismaUser.name ?? "",
					email: prismaUser.email ?? "",
					emailVerified: null,
					avatar_url: prismaUser.avatar_url ?? "",
				} as AdapterUser;
			} catch (error) {
				throw new Error(`Error updating user: ${error}`);
			}
		},

		async linkAccount(account: AdapterAccount) {
			await prisma.account.create({
				data: {
					user_id: account.userId,
					type: account.type,
					provider: account.provider,
					provider_account_id: account.providerAccountId,
					refresh_token: account.refresh_token,
					access_token: account.access_token,
					expires_at: account.expires_at,
					token_type: account.token_type,
					scope: account.scope,
					id_token: account.id_token,
					session_state: account.session_state,
				},
			});
		},

		async createSession({
			sessionToken,
			userId,
			expires,
		}: Omit<AdapterSession, "id">) {
			const session = await prisma.session.create({
				data: {
					session_token: sessionToken,
					user_id: userId,
					expires,
				},
			});

			return {
				sessionToken: session.session_token,
				userId: session.user_id,
				expires: session.expires,
			} as AdapterSession;
		},

		async getSessionAndUser(sessionToken: string) {
			const prismaSession = await prisma.session.findUnique({
				where: { session_token: sessionToken },
				include: { user: true },
			});

			if (!prismaSession) return null;

			const { user, ...session } = prismaSession;

			return {
				session: {
					sessionToken: session.session_token,
					userId: session.user_id,
					expires: session.expires,
				} as AdapterSession,
				user: {
					id: user.id,
					name: user.name ?? "",
					email: user.email ?? "",
					emailVerified: null,
					avatar_url: user.avatar_url ?? "",
				} as AdapterUser,
			};
		},

		async updateSession({
			sessionToken,
			userId,
			expires,
		}: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) {
			const session = await prisma.session.update({
				where: { session_token: sessionToken },
				data: { user_id: userId, expires },
			});

			return {
				sessionToken: session.session_token,
				userId: session.user_id,
				expires: session.expires,
			} as AdapterSession;
		},

		async deleteSession(sessionToken: string) {
			await prisma.session.delete({ where: { session_token: sessionToken } });
		},
	};
}
