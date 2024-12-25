const { getPrisma } = require("../utils/prismaConnector");

async function unshush(args) {
    const { payload, client } = args;
    const { user_id, text, channel_id } = payload;
    const prisma = getPrisma();
    const commands = text.split(" ");
    const userToBan = commands[0].split('|')[0].replace("<@", "");
    let channel = commands[1].split('|')[0].replace("<#", "");
    const getUser = await prisma.user.deleteMany({ where: { user: userToBan } });


    if (!userToBan || !channel || !userToBan && !channel) { 
      await client.chat.postEphemeral({
        channel: `${channel_id}`,
        user: `${user_id}`,
        text: "Invaild arugements"
      })
    }
    else {
      const updateUser = await prisma.user.deleteMany({ where: { user: userToBan } });
    }
  await client.chat.postMessage({
      channel: userToBan,
      text: `You were unshushed`
    });
    await client.chat.postMessage({
      channel: process.env.MIRRORCHANNEL,
      text: `<@${userToBan}> was unshushed`,
      mrkdwn: true
        });
}

module.exports = unshush;