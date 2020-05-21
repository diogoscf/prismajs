/**
 * Wrapper for Prismanalytics, interfacing with discord.js
 * @module prismajs
 */
const fetch = require("node-fetch");
const PRISMA_URL = "https://prismalytics.herokuapp.com/send_data";

/** Prismanalytics class */
class Prismalytics {
  /**
   * Create a new Prismanalytics instance
   * @param {String} key Prismalytics token
   * @param {Boolean} [save_server] Whether to save server data
   */
  constructor(key, saveServer = true) {
    this.key = key;
    this.saveServer = saveServer;
    this.commands = {};
    this.servers = [];
    this.lastRun = null;
    this.initialRun = true;
  }

  /**
   * Process data from a message
   * @param {Object} msg Discord.js message
   */
  processData(msg) {
    const [message] = msg.content.split(" ");
    if (Object.keys(this.commands).includes(message)) {
      this.commands[message] += 1;
    } else {
      this.commands[message] = 1;
    }

    if (this.saveServer) {
      const serverMatch = this.servers.findIndex((el) => el.name === msg.guild.name);
      if (serverMatch === -1 || serverMatch === undefined) {
        const newServer = {
          name: msg.guild.name,
          member_count: msg.guild.memberCount,
          region: msg.guild.region,
          id: msg.guild.id,
          bot_messages: 1
        };
        this.servers.push(newServer);
      } else {
        this.servers[serverMatch].bot_messages += 1;
      }
    }
  }

  /**
   * Process data from a message and send data to analytics platform
   * @param {Object} msg Discord.js message
   */
  send(msg) {
    this.processData(msg);

    const now = new Date();
    if (this.lastRun === null || (now - this.lastRun) / 60000 > 2) {
      this.initialRun = false;
      this.lastRun = now;

      const body = {
        commands: this.commands,
        save_server: this.saveServer
      };
      if (this.saveServer) {
        body.servers = this.servers;
      }

      const data = {
        method: "POST",
        headers: {
          key: this.key,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      };

      fetch(PRISMA_URL, data)
        .then(async (resp) => {
          if (resp.ok) {
            this.commands = {};
            this.servers = [];
          } else {
            const respText = await resp.text();
            console.error(`Bad response while trying to send data to Prismalytics\nStatus code: ${resp.status}\nError message: ${respText}`);
          }
        })
        .catch(console.error);
    }
  }
}

module.exports = Prismalytics;
