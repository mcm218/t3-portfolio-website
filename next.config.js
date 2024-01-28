/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import { withSentryConfig } from "@sentry/nextjs";
/** @type {import("next").NextConfig} */
const config = {
    sentry: {},
};

export default withSentryConfig(config);

// Injected content via Sentry wizard below
