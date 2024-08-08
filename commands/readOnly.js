async function readOnly(args) {
    const { payload, client } = args
    const { text, channel_id, user_id } = payload
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();
    let commands = text.split(" ");
    // let userToBan = commands[1].split('|')[0].replace("<@", "")

    let channel = commands[0].split('|')[0].replace("<#", "")

    // console.log(payload)
    console.log(user_id)

    if (!text)
        return await client.chat.postEphemeral({
            user: user_id,
            channel: channel_id,
            text: `Please provide a channel ID!`
        })

    await prisma.channel.create({
        data: {

        }
    })



    //  update primsa for channel with readOnly: true 
    let dbChannel = await prisma.channels.findFirst({
        where: {
            id: channel
        }
    })

    if (dbChannel.readOnly === true) {
        await prisma.channels.update({
            where: {
                id: channel
            },
            data: {
                readOnly: false
            }
        })
        await client.chat.postMessage({
            channel: channel,
            text: `Channel is no longer read only`
        })
    } else {
        await prisma.channels.update({
            where: {
                id: channel
            },
            data: {
                readOnly: true
            }
        })
        await client.chat.postMessage({
            channel: channel,
            text: `Channel is now read only`
        })
    }
    return;

}

module.exports = readOnly;