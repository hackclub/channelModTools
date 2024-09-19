const chrono = require('chrono-node');
const { getPrisma } = require('../utils/prismaConnector');


async function slowMode(args) {
    const { payload, client } = args
    const { user_id, text, channel_id } = payload
    const prisma = getPrisma();

    const userInfo = await client.users.info({ user: user_id });

    
}

module.exports = slowMode;