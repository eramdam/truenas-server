import express from "express";
import env from "../config/env.json";
import { makeEmailForCloudSync } from "./email";
import { delayAsync } from "./helpers";
import { getCloudSync, sendEmail } from "./trueNasApi";

export function mountServer() {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello world");
  });

  app.get("/cloud_sync/notify/:id", async (req, res) => {
    try {
      console.log("Waiting 2 secondes...");
      await delayAsync(2000);
      const id = Number(req.params.id);
      console.log("Getting cloud sync with id ", id);
      const sync = await getCloudSync(id);
      console.log(sync);

      const emailText = makeEmailForCloudSync(sync);
      console.log(emailText);

      await sendEmail({
        description: sync.description,
        text: emailText
      });

      console.log("Email sent to " + env.email);
      res.send("Email sent to " + env.email);
    } catch (e) {
      res.status(500).send(String(e));
    }
  });

  app.listen(env.port, () => {
    console.log(`listening on localhost:${env.port}`);
  });
}
