const { getPrisma } = require("../utils/prismaConnector");

async function shushBan(args) {
  const { payload, client } = args;
  const { user_id, text, channel_id } = payload;
  const prisma = getPrisma();

  const userInfo = await client.users.info({ user: user_id });
  const isAdmin = userInfo.user.is_admin;
  const commands = text.split(" ");
  const userToBan = commands[0].split("|")[0].replace("<@", "");
  const reason = commands.slice(1).join(" ");

  // // const userProfile = await client.users.profile.get({ user: userToBan });
  // const profilePhoto = userProfile.profile.image_512;
  // const displayName = userProfile.profile.display_name;

  const isSelfShush = userToBan === user_id;
  const errors = [];
  if (!isAdmin && !isSelfShush) errors.push("Non-admins can only shush themselves.");
  if (!reason && !isSelfShush) errors.push("A reason is required.");
  if (!userToBan) errors.push("A user is required");

  if (errors.length > 0)
    return await client.chat.postEphemeral({
      user: `${user_id}`,
      text: errors.join("\n"),
    });

  try {
    if (!isSelfShush) {
      await client.chat.postMessage({
        channel: process.env.MIRRORCHANNEL,
        text: `<@${user_id}> banned <@${userToBan}> from all Slack channels. ${reason ? `for ${reason}` : ""}`,
      });
    }

    await prisma.bans.create({
      data: {
        admin: user_id,
        reason: reason,
        user: userToBan,

        // profile_photo: profilePhoto,
        // display_name: displayName,
      },
    });

    if (!isSelfShush) {
      await client.chat.postMessage({
        channel: userToBan,
        text: "You've been banned from talking in all Slack channels for a short period of time. A FD member will reach out to you shortly.",
      });
    }
    console.log(`Banned user ${userToBan} for reason: ${reason}`);

    if (isSelfShush) {
      await client.chat.postEphemeral({
        channel: channel_id,
        user: user_id,
        text: `You've been banned from talking in all Slack channels.`,
      });
    } else {
      await client.chat.postEphemeral({
        channel: channel_id,
        user: user_id,
        text: `<@${userToBan}> has been banned from all channels for ${reason}`,
        mrkdwn: true,
      });
    }
  } catch (e) {
    await client.chat.postEphemeral({
      channel: channel_id,
      user: user_id,
      text: `An error occured: ${e}`,
    });
  }
}

module.exports = shushBan;
