import _ from "lodash";
import { CloudSync } from "./trueNasApi";

export function makeEmailForCloudSync(cloudSync: CloudSync) {
  return _([
    `Job: ${cloudSync.description}\n`,
    cloudSync.job &&
      `Started: ${new Date(
        cloudSync.job.time_started?.$date || 0
      ).toLocaleString()}`,
    cloudSync.job?.time_finished?.$date &&
      `Finished: ${new Date(
        cloudSync.job.time_finished?.$date
      ).toLocaleString()}\n`,
    cloudSync.job && `Log: ${cloudSync.job.progress.description}\n`,
    cloudSync.job?.logs_excerpt && `${cloudSync.job.logs_excerpt}`,
    `Date/Time: ${new Date().toLocaleString()}`
  ])
    .compact()
    .join("\n")
    .trim();
}
