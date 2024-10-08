const chrono = require('chrono-node');
const { getPrisma } = require('../utils/prismaConnector');


async function slowmode(args) {
    const { payload, client } = args;
    const { user_id, text, channel_id } = payload;
    const prisma = getPrisma();
    const commands = text.split(" ");
    let channel = commands[1].split('|')[0].replace("<#", "");
    

 
 
  }

module.exports = slowmode;