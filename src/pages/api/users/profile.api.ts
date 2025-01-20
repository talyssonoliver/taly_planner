import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { buildNextAuthOptions } from "../auth/[...nextauth].api";

const updateProfileBodySchema = z.object({
  bio: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  const session = (await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )) as { user: { id: string; name?: string; email?: string; image?: string } };

  if (!session || !session.user) {
    return res.status(401).end();
  }

  const { bio } = updateProfileBodySchema.parse(req.body);

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bio,
    },
  });

  return res.status(204).end();
}
