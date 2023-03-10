import { KnownEventFromType} from "@slack/bolt";
import { app } from "./Init";
import { getAllVirtualMention, getGroupDatas } from "./PrepareData";
require("dotenv").config();

type Message = KnownEventFromType<"message">;
const allVirtualMention = getAllVirtualMention();
(async () => {
  try {
    let header = "";
    let canSend = false;
    const GroupDatas = await getGroupDatas();
    //リプライパターンに合致した場合、所属別のメンションヘッダを生成
    GroupDatas.forEach(groupData => {
      const exp = groupData.virtualMentionReg;
      app.message(exp, async () => {
        header+=groupData.actualMentions;
        canSend=true;
      })
    });

    //全てのリプライパターンによって発火する。最終的にはここでメッセージを送る
    app.message(allVirtualMention, async ({ message, say }) => {
      const link = (await app.client.chat.getPermalink({
        channel: message.channel,
        message_ts: message.event_ts,
      })).permalink;


      if (canSend) {
        say(header + "\n" + link);
        header = "";
        canSend = false;
      }
    });

    //Boot Bot
    (async () => {
      await app.start();
      console.log("⚡️ Bolt app is running!");
    })();


  } catch (err) {
    console.log(err);
  }
})();