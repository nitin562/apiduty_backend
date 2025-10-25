import { proxyActivities } from "@temporalio/workflow";

const { imageCleanActivity } = proxyActivities({
  retry: {
    initialInterval: "1 second", // amount of time that must elapse before the first retry occurs.
    maximumInterval: "1 minute", // maximum interval between retries.
    backoffCoefficient: 2, // how much the retry interval increases.
    maximumAttempts: 5, // maximum number of execution attempts. Unspecified means unlimited retries.
  },
  startToCloseTimeout: "1 minute", // maximum time allowed for a single Activity Task Execution.
});


export async function cleanImage(path){
    return await imageCleanActivity(path)
}
