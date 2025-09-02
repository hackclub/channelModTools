const { user } = require("slack-block-builder");
const { getPrisma } = require("../utils/prismaConnector");

async function unshush(args) {
  const { payload, client } = args;
  const { user_id, text, channel_id } = payload;
  const prisma = getPrisma();
  const commands = text.split(" ");
  const userInfo = await client.users.info({ user: user_id });
  const isAdmin = userInfo.user.is_admin;
  const userToBan = commands[0].split("|")[0].replace("<@", "");
  console.log(userToBan);

  // const isSelfUnshush = userToBan === user_id;

  if (!isAdmin) {
    return;
  }

  if (isAdmin) {
    await client.chat.postMessage({
      channel: process.env.MIRRORCHANNEL,
      text: `<@${userToBan}> was unshushed`,
      mrkdwn: true,
    });

    const updateUser = await prisma.Bans.deleteMany({
      where: { user: userToBan },
    });

    console.log("I'm working");

    await client.chat.postMessage({
      channel: userToBan,
      text: `You were unshushed`,
    });
  }
}

module.exports = unshush;
