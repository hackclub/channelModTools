const readOnly = require("../commands/readOnly");
const { getPrisma } = require("../utils/prismaConnector")
require("dotenv").config();


async function cleanupChannel(args) {
    const { client, payload } = args
    const { user, ts, thread_ts, text, channel, subtype } = payload
    const prisma = getPrisma();
    
    console.log(payload);


    const getChannel = await prisma.Channel.findFirst({
        where: {
            id: channel,
            readOnly: true,
        }
    })

    const allowlist = await prisma.Channel.findFirst({
        where: {
            allowlist: {
              has: user,
            },
          },
        })


    if (!getChannel) return;

    if (thread_ts) return;

    if (!allowlist) {
        await client.chat.postMessage({
            channel: channel,
            text: "You can't post here"
        })
        await client.chat.delete({
            channel: channel,
            ts: ts,
            token: process.env.SLACK_USER_TOKEN,
        })
    }


    
    await client.chat.postMessage({
        channel: channel,
        text: "Read only"
    })





}


 module.exports = cleanupChannel;