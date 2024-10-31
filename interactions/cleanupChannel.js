const readOnly = require("../commands/readOnly");
const { getPrisma } = require("../utils/prismaConnector")
require("dotenv").config();


async function cleanupChannel(args) {
    const { client, payload } = args
    const { user, ts, thread_ts, text, channel, subtype } = payload
    const prisma = getPrisma();
    const userInfo = await client.users.info({ user: user });
    const isAdmin = (await userInfo).user.is_admin;


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

    if (subtype == "bot_message" && allowlist) return;
    
    if (!allowlist) {
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