const { PrismaClient } = require("@prisma/client");
const { getPrisma } = require("../utils/prismaConnector");



async function readOnly(args) {
    const { payload, client } = args;
    const { text, channel_id, user_id } = payload;
    const prisma = getPrisma();
    const commands = text.split(" ");
    const channel = commands[0].split('|')[0].replace("<#", "");
    const isAdmin = (await userInfo).user.is_admin;

    if (!isAdmin) return;

    const errors = []
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
        allowlist: []
    }
})
    } else {
            await prisma.Channel.delete({
                where:{
                    id: channel
                }
                })
    }
} catch(e) {
    console.log(e);
}





}


module.exports = readOnly;