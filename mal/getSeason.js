const {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed
} = require("discord.js");
const SeasonInteraction = require("./getSeasonInteraction");

module.exports = {
  async MalSeason(res, i) {
    const result = res.slice(0, 10);
    const menus = [];

    for (const data of result) {
      menus.push({
        label: data.title,
        value: data.title,
        description: `Information About "${
          data.title.length ? data.title.substring(0, 20) + "..." : data.title
        }"`
      });
    }

    const select = new MessageSelectMenu()
      .setCustomId("tv-select")
      .addOptions(menus);

    const row = new MessageActionRow().addComponents([select]);

    try {
      const msg = await i.channel.send({
        content: "Choice your anime at this menus",
        components: [row]
      });

      SeasonInteraction.awaitSeasonInteraction(msg, i.member);
    } catch (er) {
      i.reply({
        content:
          "There is something was wrong when fetching the data, maybe the title is to loong, so i can't display it\nIf this is a bug, feel free to contact my developer at my support server.",
        ephemeral: true
      });
      console.log(er.stack);
    }
  }
};
