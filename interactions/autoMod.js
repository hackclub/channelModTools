const Airtable = require('airtable');
console.log("autoMod loaded");
// console.log("Banned words", process.env.BANNED_WORDS);

async function autoMod(args) {
    const { client, body } = args;
    const { event } = body;
    let { type, subtype, user, channel, ts, text } = event;




const bannedWords = process.env.BANNED_WORDS
  ? process.env.BANNED_WORDS.split(',').map(w => w.trim().toLowerCase())
  : [];

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const airtableTable = process.env.AIRTABLE_TABLE;


let botUserId;

async function initBotUserId(client) {
  if (!botUserId) {
    try {
      const authRes = await client.auth.test();
      botUserId = authRes.user_id;
    } catch (e) {}
  }
}


  if (!event || event.type !== 'message' || event.subtype) return;

  await initBotUserId(client);

  if (event.user === botUserId) return;

  text = text?.toLowerCase();
  if (!text) return;

  const matchedWords = bannedWords.filter(word => text.includes(word));
  if (matchedWords.length === 0) return;

  try {
    const permalinkRes = await client.chat.getPermalink({
      channel: event.channel,
      message_ts: event.ts,
    });

    


    const userInfoRes = await client.users.info({ user: event.user });
    const username = userInfoRes.user?.real_name || userInfoRes.user?.name || `<@${event.user}>`;

    await client.chat.postMessage({
      channel: process.env.MIRRORCHANNEL,
      text: `:siren-real: Message "${event.text}" auto deleted in <#${event.channel}>. It was sent by: <@${event.user}>. :siren-real: \n 🔗 ${permalinkRes.permalink} \n Reply with :white_check_mark: once dealt with.`
    });


    await new Promise(resolve => setTimeout(resolve, 2000));

await client.chat.delete({
      channel: event.channel,
      ts: event.ts,
      token: process.env.SLACK_USER_TOKEN
    });
    
    await client.chat.postEphemeral({
      channel: event.channel,
      user: event.user,
      text:
        ':siren-real: MESSAGE DELETED :siren-real:\n' +
        "Your message violated <https://hackclub.com/conduct/|Hack Club's Code of Conduct>. " +
        'A Fire Department member should contact you soon. If you believe this was an error, please let us know. ' +
        'Using words that violate our Code of Conduct can result in a *permanent ban* depending on their severity. ' +
        'Please try to keep Hack Club a safe space for everyone. Thank you.'
    });

    await client.chat.postMessage({
      channel: event.user,
      text:
        ':siren-real: MESSAGE DELETED :siren-real:\n' +
        "Your message violated <https://hackclub.com/conduct/|Hack Club's Code of Conduct>. " +
        'A Fire Department member should contact you soon. If you believe this was an error, please let us know. ' +
        'Using words that violate our Code of Conduct can result in a *permanent ban* depending on their severity. ' +
        'Please try to keep Hack Club a safe space for everyone. Thank you.'
    });

    await base(airtableTable).create({
      "Display Name (user)": username,
      "User ID": event.user,
      "Message": event.text
    });

  } catch (err) {
    console.error('Error in autoMod:', err);
    await client.chat.postEphemeral({
      channel: event.channel,
      user: event.user,
      text: `An error occurred while processing your message. Please try again later${err.message ? `: ${err.message}` : ''}`
    });
  }
};

module.exports = autoMod;


