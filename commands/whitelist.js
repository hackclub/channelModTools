const { PrismaClient } = require("@prisma/client");
const { getPrisma } = require("../utils/prismaConnector");



async function whitelist(args) {
    const { payload, client } = args;
    const { text, channel_id, user_id } = payload;
    const prisma = getPrisma();
    const commands = text.split(" ");
    const userInfo = await client.users.info({ user: user_id });
    const channel = commands[0].split('|')[0].replace("<@", "");
    const isAdmin = (await userInfo).user.is_admin;


    const errors = []
    if (!isAdmin) errors.push("Only admins can run this command.");
    if (!channel) errors.push("You need to give a channel to make it read only");



    if (errors.length > 0)
        return await client.chat.postEphemeral({
            channel: `${channel_id}`,
            user: `${user_id}`,
            text: errors.join("\n")
        });


    const isReadOnly = await prisma.Channel.findFirst({
        where: {
            id: channel,
            readOnly: true
        }
    })


    try {
        if (!isReadOnly) {
            await prisma.Channel.create({
                data: {
                    id: channel,
                    readOnly: true,
                    allowlist: ["U01MPHKFZ7S"]
                }
            })
            await client.chat.postMessage({
                channel: channel,
                text: `<#${channel}> was made read-only by <@${user_id}>`
            })

        } else {
            await prisma.Channel.delete({
                where: {
                    id: channel
                }
            })
            await client.chat.postMessage({
                channel: channel,
                text: `<#${channel}> was made no longer read-only by <@${user_id}>`
            })
        }
    } catch (e) {
        console.log(e);
    }





}


module.exports = whitelist;