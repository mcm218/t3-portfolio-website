import { postRouter } from "~/server/api/routers/post";
import {
    resumeRouter,
    resumeAdminRefineRouter,
} from "~/server/api/routers/resume";
import { createTRPCRouter } from "~/server/api/trpc";
import { personalLinkRouter } from "./routers/personalLink";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    post: postRouter,
    resume: resumeRouter,
    personalLink: personalLinkRouter,
    resumeAdmin: resumeAdminRefineRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
