import express from "express";
import env from "../config/env.json";
import { makeEmailForCloudSync } from "./email";
import { getCloudSync, sendEmail } from "./trueNasApi";

export function mountServer() {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello world");
  });

  app.get("/cloud_sync/notify/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const sync = await getCloudSync(id);

      const emailText = makeEmailForCloudSync(sync);

      await sendEmail({
        description: sync.description,
        text: emailText
      });

      res.send("Email sent to " + env.email);
    } catch (e) {
      res.status(500).send(String(e));
    }
  });

  app.listen(env.port, () => {
    console.log(`listening on localhost:${env.port}`);
  });
}
