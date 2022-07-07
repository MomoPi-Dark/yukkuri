const getAnimeName = require("./getModelAnimeName");

module.exports = {
  async awaitRefrenseInteraction(msg, member) {
    const i = await msg
      .awaitMessageComponent({
        filter: (m) => m.member.id === member.id,
        max: 1,
        time: 6e4,
      })
      .catch((er) => er);

    if (i instanceof Error) return;
    await i.deferReply().catch((er) => er);
    i.deleteReply();

    try {
      switch (i.customId) {
        case "refrense-select": {
          const value = i.values[0];

          const animes = await getAnimeName.awaitModelAnime(value);

          msg.edit({
            embeds: [animes.embed],
            components: [animes.row],
            content: `Anime ${res.title}`,
          });
          break;
        }
      }
    } catch (er) {
      i.reply({
        content:
          "There is something was wrong, please contact my developer at my support server",
        ephemeral: true,
      });
      console.error(er);
    }
  },
};
