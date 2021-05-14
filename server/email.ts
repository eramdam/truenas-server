import { CloudSync } from "./cloudSyncTypes";
import _ from "lodash";

export function makeEmailForCloudSync(cloudSync: CloudSync) {
  return _([
    `Job: ${cloudSync.description}\n`,
    cloudSync.job &&
      `Started: ${new Date(
        cloudSync.job.time_started?.$date || 0
      ).toLocaleString()}`,
    (cloudSync.job?.time_finished &&
      `Finished: ${new Date(
        cloudSync.job.time_finished?.$date || 0
      ).toLocaleString()}\n`) ||
      "Finished: In progress...",
    cloudSync.job && `Log: ${cloudSync.job.progress.description}\n`,
    cloudSync.job?.logs_excerpt && `${cloudSync.job.logs_excerpt}`
  ])
    .compact()
    .join("\n")
    .trim();
}
