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

      // Generate the email text
      const emailText = makeEmailForCloudSync(sync);
      console.log(emailText);

      const isFinished = Boolean(sync.job?.time_finished?.$date);

      // Send it
      await sendEmail({
        description: isFinished
          ? `Finished ${sync.description}`
          : `Started ${sync.description}`,
        text: emailText
      });

      console.log("Email sent to " + env.email);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  });

  app.listen(env.port, () => {
    console.log(`listening on localhost:${env.port}`);
  });
}
