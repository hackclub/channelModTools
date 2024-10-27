const readOnly = require("../commands/readOnly");
const { getPrisma } = require("../utils/prismaConnector")
require("dotenv").config();


async function cleanupChannel(args) {
    const { client, payload } = args
    const { user, ts, text, channel, subtype } = payload
    const prisma = getPrisma();




    const getChannel = await prisma.Channel.findFirst({
        where: {
            id: channel,
            readOnly: true
        }
    })


    if (!getChannel) return; 

    
    await client.chat.postMessage({
        channel: channel,
        text: "Read only"
    })




        await client.chat.postMessage({
            channel: channel,
            text: "test"
        })
}


 module.exports = cleanupChannel;