const { App, LogLevel } = require("@slack/bolt");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    // Using socket mode, however we still want for it to reply to OAuth
    port: process.env.PORT || 3000,
});

app.message(/.*/gim, async ({ message, say, body, client }) => { // Listen for all messages (/.*/gim is a regex)    await say("hello") 
    const userID = message.user;
    const channel = message.channel;
    let messageText = message.text;
    let userData = await prisma.user.findFirst({
        where: {
            user: userID,
            channel: channel
        },
    })

    if (!userData) return;

    await app.client.chat.delete({  
        channel: channel,
        ts: message.ts,
        token: process.env.SLACK_USER_TOKEN
    });
    try {
        await app.client.conversations.kick({
            channel: channel,
            user: userID,
            token: process.env.SLACK_USER_TOKEN
        })
    } catch (e) {
        console.log("kicking failed")
    }
// await client.chat.postMessage({
//     channel: message.channel,
//     user: message.user,
//     text: `Your message has been deleted because you're banned from this channel for ${userData.reason}`
// })

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


});

app.command(/.*?/, async (ack, { command }, respond) => {

  await ack()

  switch (command) {
    case '/channelban':
        await require('./commands/channelBan')(args);
        break;
    case '/unban':
        await require('./commands/unban')(args);
        break;
    case '/read-only':
        await require('./commands/readOnly')(args);
        break;
    default:
        await respond(`I don't know how to respond to the command ${command}`);
        break;
  }

})

app.start().then(() => {
    console.log("⚡️ Bolt app is running!");
});