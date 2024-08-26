const chrono = require('chrono-node');


async function channelBan(args) {
    const { payload, client } = args
    const { command, user_id, text, channel_id } = payload
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    const userInfo = await client.users.info({
        user: user_id
    })
    const isAdmin = userInfo.user.is_admin;
    let admin = user_id;
    let commands = text.split(" ");
    let reason = commands[2]
    let userToBan = commands[0].split('|')[0].replace("<@", "")
    let channel = commands[1].split('|')[0].replace("<#", "")
   let time = chrono.parse(command[3])

    console.log(time)
    let userProfile = await client.users.profile.get({
        user: userToBan
    })
    let profile_photo = userProfile.profile.image_512;
    let display_name = userProfile.profile.display_name;

    if (!isAdmin) return await client.chat.postEphemeral({
        channel: `${channel_id}`,
        user: `${user_id}`,
        text: "Only admins can run this command"
    })
    try {
    await client.chat.postMessage({
        channel: `C07FL3G62LF`,
        text: `<@${[userToBan]}> has been banned from <#${channel}> for ${reason}`
    })
} catch (e) {
    console.log(e);
}
    try {
        await prisma.user.create({
            data: {
                admin: admin,
                reason: reason,
                user: userToBan,
                channel: channel,
                profile_photo: profile_photo,
                display_name: display_name,
                // time_nlp: time
            },
        });
    } catch (e) {
        console.log(e)
        await client.chat.postEphemeral({
            channel: channel_id,
            text: `${e}`
        })
    }
    try {
        await client.chat.postEphemeral({
            channel: `${channel_id}`,
            user: `${user_id}`,
            text: `${[userToBan]} has been banned from ${channel} for ${reason}`
        })
    } catch (e) {
        console.log(e)
    } 

}

module.exports = channelBan;