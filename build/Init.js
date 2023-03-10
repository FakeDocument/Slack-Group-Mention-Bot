"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var bolt_1 = require("@slack/bolt");
require("dotenv").config();
exports.app = new bolt_1.App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.SLACK_BOT_SIGNING_SECRET,
    socketMode: true,
});
