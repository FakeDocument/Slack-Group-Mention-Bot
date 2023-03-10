import * as fs from "fs";
import * as bolt from "@slack/bolt";
import { app } from "./Init";
//import raw from "../resources/test.json"
const rpJson = fs.readFileSync(`${__dirname}/../resource/groups.json`, { encoding: "utf-8" });
const raw = JSON.parse(rpJson);
type Data = {
    group: string,
    virtualMentionReg: RegExp,
    actualMentions:string,
    members: string[],
}

export const getGroupDatas=async ()=>{
    const userList = (await app.client.users.list()).members;
    let data: Data[] = [];


    raw.forEach(group => {
        let members = group.members;
        //includedと同じグループ名のmembersを追加
        //console.log(data.find((val)=>{return  val.group==included}));
        group.include.forEach(included => {
            members = members.concat(raw.find((val) => { return val.groupName == included }).members);
        });

        //グループのmembersに含まれるメンバーのIDを格納
        let actualMentions: string[] = [];
        group.members.forEach(member => {
            const id = userList.find(user => { return user.name == member })?.id;
            actualMentions.push(`<@${id}>`);
        });

        //発火元となるメンションヘッダを生成
        let mentionArray = (group.virtual_mention.map((val) => `(@${val})`));
        let virtualMentionStr = mentionArray.join("|");

        data.push({
            group: group.groupName,
            virtualMentionReg: RegExp(virtualMentionStr),
            actualMentions: actualMentions.join(" "),
            members: members,
        });
    });
    return data;
}
export const getAllVirtualMention=()=>{
    let allVirtualMentions: string[] = [];
    raw.forEach(group => {
        //発火元となるメンションヘッダを生成
        let mentions = (group.virtual_mention.map((val) => `(@${val})`));
        allVirtualMentions = allVirtualMentions.concat(mentions);
    });
    return RegExp(allVirtualMentions.join("|"));
}