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

    console.log(userData)
    if (userData) {
         await app.client.chat.delete({  
        channel: channel,
        ts: message.ts,
        token: process.env.SLACK_USER_TOKEN
    })
    await client.chat.postEphemeral({
        channel: message.channel,
        user: message.user,
        text: `Your message has been deleted because you're banned from this channel for ${userData.reason}`
    })


    await app.client.conversations.kick({
        channel: channel,
        user: UserID,
        token: process.env.SLACK_USER_TOKEN
    })
    messageText = `> ${messageText}`
    await client.chat.postMessage({
        channel: channel,
        text: messageText,
        username: userData.display_name,
        icon_url: userData.profile_photo,
        
    })
    
    try {
        await client.chat.postMessage({
            channel: userData.user,
            text: `:wave_pikachu_2: Your message was deleted because ${userData.reason}`,
        })

    } catch (e) {
        await say(`${e}`);
    }
  
    }

    // const isArchived = (await checkChannel).channel.is_archived;


});



app.command("/channelban", async ({ message, say, client, ack, command }) => {
    await ack()
    let text = command.text;
    let admin = command.user_id;
    let commands = text.split(" ");
    let reason = commands[2]
    let userToBan = commands[1].substring(2,13);
    let channel = commands[0].substring(2,13);
    let userProfile = await client.users.profile.get({
        user: userToBan
    })
    let profile_photo = userProfile.profile.image_512;
    let display_name = userProfile.profile.display_name;

    try {
    const user = await prisma.user.create({
        data: {
            admin: admin,
            reason: reason,
            user: userToBan,
            channel: channel,
            profile_photo: profile_photo,
            display_name: display_name,
        },
      });
    } catch(e) {
        console.log(e)
        await client.chat.postEphemeral({
            channel: command.channel_id,
            user: command.user_id,
            text: `${e}`
        })
    }
});

app.command("/unban", async ({ message, say, client, ack, command }) => {
    let text = command.text;
    let admin = command.user_id;
    let commands = text.split(" ");
    let reason = commands[2]
    let userToBan = commands[1].split('|')[0].replace("<@", "")
    console.log(userToBan)
    let channel = commands[0].split('|')[0].replace("<#", "")
    
    const updateUser = await prisma.user.delete({
        where: {
            user: userToBan,
            channel: channel
        }
      });
      await client.chat.postMessage({
        channel: userToBan,
        text: `You were unbanned from ${updateUser.channel}`
      })
});


(async () => {

    await app.start();

    console.log("⚡️ Bolt app is running!");
})();