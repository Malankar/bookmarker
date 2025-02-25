import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://df3de050185a5fc4380e720e15bd95a7@o1229781.ingest.us.sentry.io/4508881148772352",
  integrations: [nodeProfilingIntegration()],
  // Use tracesSampler to conditionally profile transactions
  tracesSampler: (samplingContext) => {
    const transactionName = samplingContext.transactionContext?.name || "";
    if (
      transactionName === "/profile" ||
      transactionName === "/v1" ||
      transactionName === "/v1/users"
    ) {
      return 1.0; // 100% sampling for these endpoints
    }
    return 0; // No profiling for other transactions
  },
});
