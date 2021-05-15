import express from "express";
import env from "../config/env.json";
import { makeEmailForCloudSync } from "./email";
import { getCloudSync, getJob, sendEmail } from "./trueNasApi";

export function mountServer() {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello world");
  });

  app.get("/cloud_sync/notify/:id", async (req, res) => {
    // Return a response early so TrueNAS considers the job done.
    res.send("Email will be sent to " + env.email);
    try {
      const id = Number(req.params.id);
      console.log("Getting cloud sync with id ", id);
      // Fetch the cloud sync
      const sync = await getCloudSync(id);
      console.log(sync);

      if (!sync.job) {
        throw new Error("No job for this sync");
      }

      // Find the corresponding job
      const job = await getJob(sync.job?.id);

      if (!job) {
        throw new Error("No job for this sync");
      }

      // Generate the email text
      const emailText = makeEmailForCloudSync(sync, job);
      console.log(emailText);

      // Send it
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
