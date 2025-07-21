const path = require("path");

async function handleEvent({ event, client, body, say }) {
  try {
    // console.log(body)
    const eventName = event.type;
    const eventFile = path.resolve(__dirname, `${eventName}.js`);

    // Dynamically require event handlers
    const eventHandler = require(eventFile);
    if (eventHandler) {
      await eventHandler({ event, client, body, say });
    } else {
      console.warn(`No handler found for event: ${eventName}`);
    }
  } catch (error) {
    if (error.type === "message") {
      return console.warn("Message event ignored:", error.message);
    }
    console.error(`Error handling event ${event.type}:`, error);
  }
}

module.exports = handleEvent;