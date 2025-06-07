const { App, LogLevel, ExpressReceiver } = require("@slack/bolt");
require("dotenv").config();
const { getPrisma } = require('./utils/prismaConnector.js');
const prisma = getPrisma();
const express = require('express')



// const receiver = new ExpressReceiver({
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
// })


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    // receiver,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000,
});

// receiver.router.use(express.json())
// receiver.router.get('/', require('./endpoints/index'))
// receiver.router.get('/ping', require('./endpoints/ping'))

app.logger.info("Firehose is starting up...");
app.logger.info(`Using Prisma version: ${prisma._version}`);
app.logger.info(`Using Slack Bolt version: ${App.version}`);


app.event("channel_created", async ({ event, client }) => {
    try {
        const channelId = event.channel.id;
        await client.conversations.join({ channel: channelId });
    } catch (e) {
        app.logger.error(e)
    } 
});


app.client.chat.postMessage({
    channel: process.env.MIRRORCHANNEL,
    text: `Firehose is online again!`
})


app.event('message', async (args) => {
    // begin the firehose
    const { body, client } = args
    const { event } = body
    const { type, subtype, user, channel, ts, text } = event

    const cleanupChannel = await require("./interactions/cleanupChannel.js");
    await cleanupChannel(args);
    const shushBan = await require("./interactions/listenforBannedUser.js");
    await shushBan(args);
    const startSlowMode = await require("./interactions/startSlowMode.js");
    await startSlowMode(args);
    const listenforChannelBannedUser = await require("./interactions/listenforChannelBannedUser.js");
    await listenforChannelBannedUser(args);


});


app.command(/.*?/, async (args) => {

    const { ack, command, respond } = args;

    await ack();

    switch (command.command) {
        case '/fs-channelban':
            await require('./commands/channelBan')(args);
            break;
        case '/fs-unban':
            await require('./commands/unban')(args);
            break;
        case '/fs-read-only':
            await require('./commands/readOnly')(args);
            break;
        case '/fs-slowmode':
            await require('./commands/slowmode.js')(args);
            break;
        case '/fs-whitelist':
            await require('./commands/whitelist.js')(args);
            break;
        case '/test-shush':
            await require('./commands/shush.js')(args);
            break;
        case '/fs-unshush':
            await require('./commands/unshush.js')(args);
            break;
        case '/purge':
            await require('./commands/purge.js')(args)
            break;
        default:
            await respond(`I don't know how to respond to the command ${command.command}`);
            break;
    }

})


// Start the app on the specified port
const port = process.env.PORT || 3000; // Get the port from environment variable or default to 3000
app.start().then(() => {
    app.logger.info(`Bolt is running on `)
});
