const { App, LogLevel } = require("@slack/bolt");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let UserID;

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
    // you still need to listen on some port!
    port: process.env.PORT || 3000,
});

app.message(/.*/gim, async ({ message, say, body, client }) => { // Listen for all messages (/.*/gim is a regex)    await say("hello") 
    UserID = message.user;
    console.log(UserID)
    const channel = message.channel;
    let messageText = message.text;
    let userData = await prisma.user.findFirst({
        where: {
            user: UserID,
            channel: channel
        },
    })

    // TODO: add check for if the channel is read only 
    
    console.log(userData)
    if (userData) {
         await app.client.chat.delete({  
        channel: channel,
        ts: message.ts,
        token: process.env.SLACK_USER_TOKEN
    })
    await client.chat.postMessage({
        channel: message.channel,
        user: message.user,
        text: `Your message has been deleted because you're banned from this channel for ${userData.reason}`
    })
    // await app.client.conversations.kick({
    //      channel: channel,
    //      user: UserID,
    //      token: process.env.SLACK_USER_TOKEN
    //  })
    messageText = `> ${messageText}`
    console.log("mirroring message")
    let mirrorChannel = process.env.MIRRORCHANNEL
    await client.chat.postMessage({
        channel: mirrorChannel,
        text: `${messageText} \n messaged deleted in <#${channel}>`,
        username: userData.display_name,
        icon_url: userData.profile_photo
    })
    
    try {
        await client.chat.postEphemeral({
            channel: mirrorChannel,
            user: UserID,
            text: `:wave_pikachu_2: Your message was deleted because ${userData.reason}`,
        })

    } catch (e) {
        await say(`${e}`);
        console.log("error here")
    }
  
    }

    // const isArchived = (await checkChannel).channel.is_archived;


});

app.command(/.*?/, async (args) => {
  const { ack, payload, respond } = args
  const { command, text, user_id, channel_id } = payload

  await ack()

  switch (command) {
    case '/channelban':
        await require('./commands/channelBan')(args)
        break;
    case '/unban':
        await require('./commands/unban')(args)
        break;
    case '/read-only':
        await require('./commands/readOnly')(args)
        break;
    default:
        await respond(`I don't know how to respond to the command ${command}`)
  }

})

app.start().then(() => {
    console.log("⚡️ Bolt app is running!");
});