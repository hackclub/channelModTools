const { PrismaClient } = require("@prisma/client");
const { getPrisma } = require("../utils/prismaConnector");


async function readOnly(args) {
    const { payload, client } = args;
    const { text, channel_id, user_id } = payload;
    const prisma = getPrisma();
    const commands = text.split(" ");
    const channel = commands[0].split('|')[0].replace("<#", "");
    

    const errors = [];
    if (!isAdmin) errors.push("Only admins can run this command.");
    if (!text)
        return await client.chat.postEphemeral({
            user: user_id,
            channel: channel_id,
            text: ``
        });

    if (errors.length > 0)
        return await client.chat.postEphemeral({
            channel: `${channel_id}`,
            user: `${user_id}`,
            text: errors.join("\n")
        });

    await prisma.channel.create({
        data: {
            readOnly: true,
            channelID: channel_id,
        }
    });



    //  update primsa for channel with readOnly: true 
    let dbChannel = await prisma.channels.findFirst({
        where: {
            id: channel
        }
    })

    if (dbChannel.readOnly) {
        await prisma.channels.update({
            where: { id: channel },
            data: { readOnly: false }
        });
        await client.chat.postMessage({ channel: channel, text: `Channel is no longer read only` });
    } else {
        await prisma.channels.update({
            where: { id: channel },
            data: { readOnly: true }
        });
        await client.chat.postMessage({ channel: channel, text: `Channel is now read only` });
    }
}

module.exports = readOnly;