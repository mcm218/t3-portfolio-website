import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const resumeRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                firstName: z.string().min(1),
                lastName: z.string().min(1),
                email: z.string().email().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.resume.create({
                data: {
                    firstName: input.firstName,
                    lastName: input.lastName,
                    email: input.email,
                    userId: ctx.session.user.id,
                },
            });
        }),

    getMyResumes: protectedProcedure.query(({ ctx }) => {
        return ctx.db.resume.findMany({
            where: { userId: ctx.session.user.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                personalLinks: true,
            },
        });
    }),
});
