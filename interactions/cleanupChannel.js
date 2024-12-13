const readOnly = require("../commands/readOnly");
const { getPrisma } = require("../utils/prismaConnector")
require("dotenv").config();
// Importing exposed groups of objects

import { Surfaces, Blocks, Elements, Bits, Utilities } from 'slack-block-builder';

// Importing objects top-level

import { Modal, Section, Actions, Button } from 'slack-block-builder';




async function cleanupChannel(args) {
    const { client, payload } = args
    const { user, ts, thread_ts, text, channel, subtype, bot_id } = payload
    const prisma = getPrisma();
    const userInfo = await client.users.info({ user: user });
    const isAdmin = (await userInfo).user.is_admin;

    const myModal = () => {
        return Modal({ title: 'Hello World' })
          .blocks(
            Blocks.Section({ text: 'This is just a super simple example.'}),    
            Blocks.Input({ label: 'Who\'s your favorite colleague?' })
              .element(
                Elements.UserSelect({ placeholder: 'I\'ll keep it a secret...'})  
                  .confirm(
                    Bits.ConfirmationDialog({
                      title: 'You sure that\'s your favorite?',
                      text: 'There\'s no turning back.',
                      confirm: 'Yep',
                      deny: 'On Second Thought'
                    }))))
          .buildToJSON();   
      };

    if (isAdmin) return;

    const getChannel = await prisma.Channel.findFirst({
        where: {
            id: channel,
            readOnly: true,
        }
    })

    const allowlist = await prisma.Channel.findFirst({
        where: {
            id: channel,
            allowlist: {
              has: user,
            },
          },
        })

    if (!getChannel) return;
    if (thread_ts) return;

    if (!allowlist) {
        if (bot_id) {
            await client.chat.delete({
                channel: channel,
                ts: ts,
                token: process.env.SLACK_USER_TOKEN,
            })
            return;
        }
        
        await client.chat.postEphemeral({
            channel: channel,
            user: user,
            text: "This channel is read-only! If you're replying to something, send a message in a thread."
        })
        await client.chat.delete({
            channel: channel,
            ts: ts,
            token: process.env.SLACK_USER_TOKEN,
        })

       
    }
}


 module.exports = cleanupChannel;