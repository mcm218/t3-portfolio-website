import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const personalLinkRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                resumeId: z.string().min(1),
                name: z.string().min(1),
                url: z.string().url().min(1),
                type: z.enum([
                    "github",
                    "linkedin",
                    "twitter",
                    "facebook",
                    "instagram",
                    "youtube",
                    "twitch",
                    "website",
                    "discord",
                    "other",
                ]),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.personalLink.create({
                data: {
                    resumeId: input.resumeId,
                    name: input.name,
                    url: input.url,
                    type: input.type,
                },
            });
        }),

    getLinksFor: protectedProcedure
        .input(
            z.object({
                resumeId: z.string().min(1),
            }),
        )
        .query(({ ctx, input }) => {
            return ctx.db.personalLink.findMany({
                where: { resumeId: input.resumeId },
                select: {
                    id: true,
                    resumeId: true,
                    name: true,
                    url: true,
                    type: true,
                },
            });
        }),
});
