# PrismaJS

Wrapper for Prismalytics, interfacing with discord.js

## Setup

Install prismalytics with npm:

`npm install prismajs`

1. Create an account / login at https://prismalytics.herokuapp.com and register a new bot.

2. Copy its token

3. Initialize the connection with our library like this:

```js
const Prismalytics = require("prismajs");
analytics = new Prismalytics("<Prismalytics Token>");
```

4. Call `analytics.send(message)` whenever your bot registers a command. For example:

```js
bot.on("message", (message) => {
  if (message.content.startsWith("<BOT PREFIX HERE>")) {
    analytics.send(message);
  }
})
```

This will send the data to our API through the library and you'll have a beautiful dashboard like this:

![demo](https://raw.githubusercontent.com/Uzay-G/prisma.py/master/galena2.gif)
