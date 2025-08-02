import cron from "cron";
import https from "https";
import { config } from "./config";

export const cronJob = new cron.CronJob("*/14 * * * *", () => {
    https.get(`${config.apiUrl}/api/health`, (res) => {
        res.statusCode === 200 ? 
            console.log("Cron job executed successfully") : 
            console.log("Cron job failed", res.statusCode);
    })
    .on("error", (err) => {
        console.log("Cron job failed: ", err);
    });
});