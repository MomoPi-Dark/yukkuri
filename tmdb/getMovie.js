const { MessageSelectMenu, MessageActionRow } = require("discord.js");
const Interaction = require("./getMovieInteraction");

module.exports = {
  async getMovieDetails(data, i) {
    const res = data.results.slice(0, 5);

    if (!res.length) {
      return i.channel.send({
        content: "Sorry, There is no result for movie that you want to search"
      });
    }
    const select = [];

    for (const data of res) {
      select.push({
        label: data.title,
        value: data.title,
        description: `Get information about "${data.title}"`
      });
    }

    const menu = new MessageSelectMenu()
      .setCustomId("movie-select")
      .addOptions(select);

    const row = new MessageActionRow().addComponents([menu]);

    const msg = await i.channel.send({
      content: "Choice the movie from menu bellow",
      components: [row]
    });
    Interaction.awaitMovieInteraction(msg, data, i.member);
  }
};
