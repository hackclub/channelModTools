const readOnly = require("../commands/readOnly");
const { getPrisma } = require("../utils/prismaConnector");
require("dotenv").config();

async function cleanupChannel(args) {
    const { client, payload } = args;
    const { user, ts, thread_ts, text, channel, subtype, bot_id } = payload;
    const prisma = getPrisma();

    const userInfo = await client.users.info({ user: user });
    const isAdmin = userInfo.user.is_admin;

    if (isAdmin) return;
    
    const getChannel = await prisma.Channel.findFirst({
        where: {
            id: channel,
            readOnly: true,
        }
    });
    console.log(getChannel)

    const allowlist = await prisma.Channel.findFirst({
        where: {
            id: channel,
            allowlist: {
                has: user,
            },
        }
    });

    if (!getChannel) return;

    if (thread_ts) {
        try {
            const threadMessage = await client.conversations.replies({
                channel: channel,
                ts: thread_ts,
            });
            
            const isThreadBroadcast = threadMessage.messages.some(msg => msg.subtype === 'thread_broadcast');

            if (isThreadBroadcast) {
                await client.chat.delete({
                    channel: channel,
                    ts: ts,
                    token: process.env.SLACK_USER_TOKEN,
                });

                if (!bot_id) {
                    await client.chat.postEphemeral({
                        channel: channel,
                        user: user,
                        text: "This channel is read-only! If you're replying to something, send a message in a thread.",
                    });
                }
            }
        } catch (e) {
            console.error("Error fetching thread messages:", e);
        }
        return;
    }

    if (subtype === 'file_share' || !allowlist) {
        try {
            await client.chat.delete({
                channel: channel,
                ts: ts,
                token: process.env.SLACK_USER_TOKEN,
            });
        } catch (e) {
            console.error("Error deleting message:", e);
        }

        if (!bot_id) {
            await client.chat.postEphemeral({
                channel: channel,
                user: user,
                text: "This channel is read-only! If you're replying to something, send a message in a thread.",
            });
        }
    }
}

module.exports = cleanupChannel;
