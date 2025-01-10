const chrono = require('chrono-node');
const { getPrisma } = require('../utils/prismaConnector');
const channelBan = require('./channelBan');
require("dotenv").config();


async function banList(args) {
    const { payload, client } = args;
    const { user_id, text, channel_id } = payload;
    const prisma = getPrisma();

    const userInfo = await client.users.info({ user: user_id });
    const isAdmin = userInfo.user.is_admin;
    const commands = text.split(" ");
    const reason = commands[2]
    const userToCheck = commands[0].split('|')[0].replace("<@", "");
    const channeltoCheck = commands[1].split('|')[0].replace("<#", "");
=


    const errors = []
    if (!isAdmin) errors.push("Only admins can run this command.");
    if (!reason) errors.push("A reason is required.")
    if (!userToBan) errors.push("A user is required")
    if (!channel) errors.push("A channel is required")
    
    const channelBans = await prisma.User.findMany();
    
    await client.chat.postMessage({
        channel: process.env.MIRRORCHANNEL,
        text: `${channelBans}`
    })

    



}

module.exports = banList;