import axios from "axios";
import env from "../config/env.json";
import { CloudSync } from "./cloudSyncTypes";

const instance = axios.create({
  baseURL: `http://${env.host}/api/v2.0/`,
  headers: {
    Authorization: `Bearer ${env.apiKey}`
  }
});

export async function getCloudSync(id: number): Promise<CloudSync> {
  return await (
    await instance.get("/cloudsync/id/" + id)
  ).data;
}

export async function sendEmail(options: {
  description: string,
  text: string
}) {
  return await instance.post("/mail/send", {
    mail_message: {
      subject: `Cloud Sync ${options.description}`,
      to: [env.email],
      text: options.text,
      html: null
    }
  });
}
