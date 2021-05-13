import axios from "axios";
import fs from "fs";
import env from "./config/env.json";

const instance = axios.create({
  baseURL: `http://${env.host}/api/v2.0/`,
  headers: {
    Authorization: `Bearer ${env.apiKey}`
  }
});

const cloudSyncVariables = {
  CLOUD_SYNC_ID: process.env.CLOUD_SYNC_ID,
  CLOUD_SYNC_DESCRIPTION: process.env.CLOUD_SYNC_DESCRIPTION,
  CLOUD_SYNC_DIRECTION: process.env.CLOUD_SYNC_DIRECTION
};

function getLogForCloudSync() {
  try {
    return fs
      .readFileSync(
        `/mnt/middlewared/jobs/${cloudSyncVariables.CLOUD_SYNC_ID}.log`
      )
      .toString();
  } catch (e) {
    return "";
  }
}

(async () => {
  await instance.post("/mail/send", {
    mail_message: {
      subject: `[Success] Cloud Sync ${cloudSyncVariables.CLOUD_SYNC_DESCRIPTION} (${cloudSyncVariables.CLOUD_SYNC_ID})`,
      to: [env.email],
      text: getLogForCloudSync()
    }
  });
})();
