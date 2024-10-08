const chrono = require('chrono-node');
const { getPrisma } = require('../utils/prismaConnector');


async function slowmode(args) {
    const { payload, client } = args;
    const { user_id, text, channel_id } = payload;
    const prisma = getPrisma();
    const commands = text.split(" ");
    let channel = commands[0].split('|')[0].replace("<#", "");
    let count = commands[1];
    let time = commands[2];

    let createSlowMode = await prisma.slowmode.upsert({
      channel: channel,
      locked: true,
      time: time,
      messageCount: count,
    })
 
 
  }

module.exports = slowmode;