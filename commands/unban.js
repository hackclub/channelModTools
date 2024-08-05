async function unban(args) {
     const { payload, client } = args
    const { command, user_id, text, channel_id } = payload
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();
    
    let admin = user_id
    let commands = text.split(" ");
    let reason = commands[2]
    let userToBan = commands[1].split('|')[0].replace("<@", "")
    console.log(userToBan)
    let channel = commands[0].split('|')[0].replace("<#", "")
    
    const updateUser = await prisma.user.delete({
        where: {
            user: userToBan,
            channel: channel
        }
      });
      await client.chat.postMessage({
        channel: userToBan,
        text: `You were unbanned from ${updateUser.channel}`
      })
}

module.exports = unban;