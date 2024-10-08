const { getPrisma } = require("../utils/prismaConnector")
require("dotenv").config();


async function listenforBannedUser(args) {
    const { client, payload } = args
    const { user, ts, text, channel, subtype } = payload
    const prisma = getPrisma();

    if (payload.subtype === "bot_message" || !payload.user) return;
    const userID = payload.user;
    const slackChannel = payload.channel;
    let messageText = payload.text;
    let userData = await prisma.user.findFirst({
        where: {  
            user: userID,
            channel: slackChannel
        },
    });

    if (!userData) return;

    await client.chat.delete({  
        channel: slackChannel,
        ts: payload.ts,
        token: process.env.SLACK_USER_TOKEN
    });
    try {
        await client.conversations.kick({
            channel: slackChannel,
            user: userID,
            token: process.env.SLACK_USER_TOKEN
        })
    } catch (e) {
        console.log("kicking failed")
    }
    
await client.chat.postMessage({
    channel: payload.channel,
    user: payload.user,
    text: `Your message has been deleted because you're banned from this channel for ${userData.reason}`
})

    messageText = `> ${messageText}`
    console.log("mirroring message")
    let mirrorChannel = process.env.MIRRORCHANNEL;
    await client.chat.postMessage({
        channel: mirrorChannel,
        text: `${messageText}\nMessaged deleted in <#${channel}>`,
        username: userData.display_name,
        icon_url: userData.profile_photo
    });

    try {
        await client.chat.postEphemeral({
            channel: mirrorChannel,
            user: userID,
            text: `:wave_pikachu_2: Your message was deleted because ${userData.reason}`,
        })
    } catch (e) {
        await say(`An error occured: ${e}`);
    }


}

module.exports = listenforBannedUser;