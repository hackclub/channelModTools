const { getPrisma } = require("../utils/prismaConnector");

async function unban(args) {
    const { payload, client } = args;
    const { user_id, text, channel_id } = payload;
    const prisma = getPrisma();
    const commands = text.split(" ");
    const userToBan = commands[1].split('|')[0].replace("<@", "");
    let channel = commands[0].split('|')[0].replace("<#", "");
    const updateUser = await prisma.user.deleteMany({ where: { user: userToBan, channel: channel } });

    if (!userToBan || !channel || !userToBan && !channel) { 
      await client.chat.postEphemeral({
        channel: `${channel_id}`,
        user: `${user_id}`,
        text: "Invaild arugements"
      });
    }
    await client.chat.postMessage({
      channel: userToBan,
      text: `You were unbanned from ${updateUser.channel}`
    });
    await client.chat.postEphemeral({
      channel: process.env.MIRRORCHANNEL,
      text: `<@${userToBan}> was unbanned from ${updateUser.channel}`
    });
}

module.exports = unban;