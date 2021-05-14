import _ from "lodash";
import { CloudSync, CoreJob } from "./trueNasApi";

export function makeEmailForCloudSync(cloudSync: CloudSync, job: CoreJob) {
  return _([
    `Job: ${cloudSync.description}\n`,
    job &&
      `Started: ${new Date(job.time_started?.$date || 0).toLocaleString()}`,
    (job.time_finished &&
      `Finished: ${new Date(
        job.time_finished?.$date || 0
      ).toLocaleString()}\n`) ||
      "Finished: In progress...",
    job && `Log: ${job.progress.description}\n`,
    job.logs_excerpt && `${job.logs_excerpt}`,
    `Date/Time: ${new Date().toLocaleString()}`
  ])
    .compact()
    .join("\n")
    .trim();
}
