const { App, LogLevel } = require("@slack/bolt");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    // Using socket mode, however we still want for it to reply to OAuth
    port: process.env.PORT || 3000,
});

app.event('message', async (args) => {
    // begin the firehose
    const { body, client } = args
    console.log(body);
    const { event } = body
    const { type, subtype, user, channel, ts, text } = event

    const startSlowMode  = await require("./interactions/startSlowMode.js");
    await startSlowMode(args);
    const listenforBannedUser  = await require("./interactions/listenforBannedUser.js");
    await listenforBannedUser(args);
    const cleanupChannel = await require("./interactions/cleanupChannel.js");
    await cleanupChannel(args);

});

app.command(/.*?/, async (args) => {

    const { ack, command, respond } = args;

    await ack();

    switch (command.command) {
        case '/channelban':
            await require('./commands/channelBan')(args);
            break;
        case '/unban':
            await require('./commands/unban')(args);
            break;
        case '/read-only':
            await require('./commands/readOnly')(args);
            break;
        case '/slowmode':
            await require('./commands/slowmode.js')(args);
            break;
        case '/whitelist':
            await require('./commands/whitelist.js')(args);
            break;         
        default:
            await respond(`I don't know how to respond to the command ${command.command}`);
            break;
    }

})

app.start(3000).then(() => {
    console.log("⚡️ Bolt app is running!");
});