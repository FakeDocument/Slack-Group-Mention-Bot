import { App} from "@slack/bolt";
require("dotenv").config();
export const app = new App({
      token: process.env.SLACK_BOT_TOKEN,
      appToken: process.env.SLACK_APP_TOKEN,
      signingSecret: process.env.SLACK_BOT_SIGNING_SECRET,
      socketMode: true,
    });