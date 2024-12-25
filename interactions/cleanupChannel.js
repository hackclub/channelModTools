const readOnly = require("../commands/readOnly");
const { getPrisma } = require("../utils/prismaConnector")
require("dotenv").config();





async function cleanupChannel(args) {
    const { client, payload } = args
    const { user, ts, thread_ts, text, channel, subtype, bot_id } = payload
    const prisma = getPrisma();
    console.log(user)
    const userInfo = await client.users.info({ user: user });
    const isAdmin = (await userInfo).user.is_admin;

    
    if (isAdmin) return;

    const getChannel = await prisma.Channel.findFirst({
        where: {
            id: channel,
            readOnly: true,
        }
    })

    const allowlist = await prisma.Channel.findFirst({
        where: {
            id: channel,
            allowlist: {
              has: user,
            },
          },
        })

    if (!getChannel) return;
    if (thread_ts) return;

    if (!allowlist) {
        try {
        await client.chat.delete({
            channel: channel,
            ts: ts,
            token: process.env.SLACK_USER_TOKEN,
        })
    } catch(e) {
        console.log(e)
    }
        if (bot_id) {
            return;
        }
        
        await client.chat.postEphemeral({
            channel: channel,
            user: user,
            text: "This channel is read-only! If you're replying to something, send a message in a thread."
        })
        await client.chat.delete({
            channel: channel,
            ts: ts,
            token: process.env.SLACK_USER_TOKEN,
        })

       
    }
}


 module.exports = cleanupChannel;