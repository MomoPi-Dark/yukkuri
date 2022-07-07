const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path/posix");
require("dotenv").config();

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// Place your client and guild ids here
const clientId = "994271965147832421";
const guildId = "993681829796266018";

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

client.commands = new Collection();
const commandPath = path.join(__dirname, "commands");
const commandFile = fs
  .readdirSync(commandPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFile) {
  const filePath = path.join(commandPath, file);
  const command = require(filePath);

  client.commands.set(command.data.name, command);
}

client.on("ready", async () => {
  client.user.setActivity({ name: "News", type: "COMPETING" });
  console.log(`${client.user.tag} is ready to serve.`);
});

client.on("interactionCreate", async (i) => {
  if (!i.isCommand()) return;

  const command = client.commands.get(i.commandName);

  if (!command) return;

  try {
    await command.execute(i);
  } catch (err) {
    console.error(err);

    await i.reply({
      content: "There is something was wrong with the comand",
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
