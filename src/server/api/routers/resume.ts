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
            return ctx.db.resume
                .create({
                    data: {
                        firstName: input.firstName,
                        lastName: input.lastName,
                        email: input.email,
                        userId: ctx.session.user.id,
                    },
                })
                .then((resume) => {
                    return resume;
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

export const resumeAdminRefineRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.db.resume.findUnique({
                where: { id: input.id },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    personalLinks: true,
                },
            });
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                firstName: z.string().min(1),
                lastName: z.string().min(1),
                email: z.string().email().optional(),
            }),
        )
        .mutation(({ ctx, input }) => {
            return ctx.db.resume
                .update({
                    where: { id: input.id },
                    data: {
                        firstName: input.firstName,
                        lastName: input.lastName,
                        email: input.email,
                    },
                })
                .then((resume) => {
                    return resume;
                });
        }),
    create: protectedProcedure
        .input(
            z.object({
                firstName: z.string().min(1),
                lastName: z.string().min(1),
                email: z.string().email().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.resume
                .create({
                    data: {
                        firstName: input.firstName,
                        lastName: input.lastName,
                        email: input.email,
                        userId: ctx.session.user.id,
                    },
                })
                .then((resume) => {
                    return resume;
                });
        }),
    deleteOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(({ ctx, input }) => {
            return ctx.db.resume
                .delete({
                    where: { id: input.id },
                })
                .then((resume) => {
                    return resume;
                });
        }),
    getList: protectedProcedure.query(({ ctx }) => {
        return ctx.db.resume.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                personalLinks: true,
            },
        });
    }),
    getMany: protectedProcedure
        .input(z.object({ ids: z.array(z.string()) }))
        .query(({ ctx, input }) => {
            return ctx.db.resume.findMany({
                where: { id: { in: input.ids } },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    personalLinks: true,
                },
            });
        }),
    createMany: protectedProcedure
        .input(
            z.object({
                resumes: z.array(
                    z.object({
                        firstName: z.string().min(1),
                        lastName: z.string().min(1),
                        email: z.string().email().optional(),
                    }),
                ),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.resume
                .createMany({
                    data: input.resumes.map((resume) => {
                        return {
                            firstName: resume.firstName,
                            lastName: resume.lastName,
                            email: resume.email,
                            userId: ctx.session.user.id,
                        };
                    }),
                })
                .then((resumes) => {
                    return resumes;
                });
        }),
    updateMany: protectedProcedure
        .input(
            z.object({
                resumes: z.array(
                    z.object({
                        id: z.string(),
                        firstName: z.string().min(1),
                        lastName: z.string().min(1),
                        email: z.string().email().optional(),
                    }),
                ),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.resume
                .updateMany({
                    where: {
                        id: {
                            in: input.resumes.map((resume) => {
                                return resume.id;
                            }),
                        },
                    },
                    data: input.resumes.map((resume) => {
                        return {
                            firstName: resume.firstName,
                            lastName: resume.lastName,
                            email: resume.email,
                        };
                    }),
                })
                .then((resumes) => {
                    return resumes;
                });
        }),
    deleteMany: protectedProcedure
        .input(z.object({ ids: z.array(z.string()) }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.resume
                .deleteMany({
                    where: { id: { in: input.ids } },
                })
                .then((resumes) => {
                    return resumes;
                });
        }),
});
