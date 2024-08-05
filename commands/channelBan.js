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
    let userToBan = commands[1].split('|')[0].replace("<@", "")
    let channel = commands[0].split('|')[0].replace("<#", "")
    let userProfile = await client.users.profile.get({
        user: userToBan
    })
    let profile_photo = userProfile.profile.image_512;
    let display_name = userProfile.profile.display_name;

    if (isAdmin) {
        try {
            const user = await prisma.user.create({
                data: {
                    admin: admin,
                    reason: reason,
                    user: userToBan,
                    channel: channel,
                    profile_photo: profile_photo,
                    display_name: display_name,
                },
            });
        } catch (e) {
            console.log(e)
            await client.chat.postEphemeral({
                channel: channel_id,
                text: `${e}`
            })
        }
    } else {
        console.log(`Channel: ${channel_id}`)
        console.log(command)
        await client.chat.postEphemeral({
            channel: `${channel_id}`,
            user: `${user_id}`,
            text: "Only admins can run this command"
        })
    }
}

module.exports = channelBan;