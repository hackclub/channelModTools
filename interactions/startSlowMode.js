const { getPrisma } = require("../utils/prismaConnector")
require("dotenv").config();


async function startSlowMode(args) {
    const { client, payload } = args
    const { user, ts, text, channel, subtype } = payload
    const prisma = getPrisma();

    let getSlowmode = await prisma.slowmode.FindFirst({
        channel: channel,
    })

    if (!getSlowmode) return;

    a




}

module.exports = startSlowMode;