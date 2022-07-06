const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  async execute(i) {
    const responseTime = Date.now() - i.createdTimestamp;
    const embed = new MessageEmbed()
      .setColor("ORANGE")
      .setDescription(
        [
          `Latency: ${responseTime}ms`,
          `Web Socket: ${i.client.ws.ping}ms`
        ].join("\n")
      );

    i.reply({ embeds: [embed] });
  }
};
