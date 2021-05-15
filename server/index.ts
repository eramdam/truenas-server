import express from "express";
import env from "../config/env.json";
import { makeEmailForCloudSync } from "./email";
import { delayAsync } from "./helpers";
import { getCloudSync, getJob, sendEmail } from "./trueNasApi";

export function mountServer() {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello world");
  });

  app.get("/cloud_sync/notify/:id", async (req, res) => {
    res.send("Email will be sent to " + env.email);
    try {
      console.log("Waiting 2 secondes...");
      await delayAsync(2000);
      const id = Number(req.params.id);
      console.log("Getting cloud sync with id ", id);
      const sync = await getCloudSync(id);
      console.log(sync);

      if (!sync.job) {
        throw new Error("No job for this sync");
      }

      const job = await getJob(sync.job?.id);

      if (!job) {
        throw new Error("No job for this sync");
      }

      const emailText = makeEmailForCloudSync(sync, job);
      console.log(emailText);

      await sendEmail({
        description: sync.description,
        text: emailText
      });

      console.log("Email sent to " + env.email);
    } catch (e) {
      res.status(500).send(String(e));
    }
  });

  app.listen(env.port, () => {
    console.log(`listening on localhost:${env.port}`);
  });
}
