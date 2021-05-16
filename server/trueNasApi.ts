import axios from "axios";
import env from "../config/env.json";

export interface CoreJob {
  id: number;
  method: "string";
  logs_excerpt: string;
  progress: {
    percent: number,
    description: string,
    extra: any
  };
  time_started: {
    $date: number
  };
  time_finished?: {
    $date: number
  };
}

export interface CloudSync {
  id: number;
  description: string;
  direction: string;
  transfer_mode: string;
  job?: CoreJob;
}

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
      subject: options.description,
      to: [env.email],
      text: options.text,
      html: null
    }
  });
}

export async function getJob(id: number) {
  const jobs: CoreJob[] = await (await instance.get("/core/get_jobs")).data;

  return jobs.find(job => job.id === id);
}
