import axios from "axios";
import env from "./config/env.json";

const instance = axios.create({
  baseURL: `http://${env.host}/api/v2.0/`,
  headers: {
    Authorization: `Bearer ${env.apiKey}`
  }
});

async function getCloudSync(): Promise<CloudSync> {
  return await (
    await instance.get("/cloudsync/id/" + process.argv[2])
  ).data;
}

interface CloudSync {
  id: number;
  description: string;
  direction: string;
  transfer_mode: string;
  job: {
    logs_excerpt: string,
    progress: {
      percent: number,
      description: string,
      extra: any
    },
    time_started: {
      $date: number
    },
    time_finished: {
      $date: number
    }
  };
}

function makeEmail(cloudSync: CloudSync) {
  return `
Job: ${cloudSync.description}

Started: ${new Date(cloudSync.job.time_started.$date).toLocaleString()}
Finished: ${new Date(cloudSync.job.time_finished.$date).toLocaleString()}

Log: ${cloudSync.job.progress.description}

${cloudSync.job.logs_excerpt}
  `;
}

(async () => {
  const cloudSync = await getCloudSync();
  const html = makeEmail(cloudSync);

  await instance.post("/mail/send", {
    mail_message: {
      subject: `Cloud Sync ${cloudSync.description}`,
      to: [env.email],
      text: html,
      html: null
    }
  });
})();
