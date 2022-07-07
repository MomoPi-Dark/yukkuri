const { MessageSelectMenu, MessageActionRow } = require("discord.js");
const getRefrenseInteraction = require("./getRefrenseInteraction");

module.exports = {
  async MalRefrense(res, i) {
    const result = res.slice(0, 10);
    const menu = [];

    for (const op of result) {
      menu.push({
        label: op.anime.substring(0, 70) + "...",
        value: op.anime,
        description: `Information About "${op.anime}"`,
      });
    }

    const select = new MessageSelectMenu()
      .setCustomId("refrense-select")
      .addOptions(menu);

    const row = new MessageActionRow().addComponents([select]);
 
    
    try {
      const msg = await i.channel.send({
        content: "Choice your anime at this menus",
        components: [row],
      });

      getRefrenseInteraction.awaitRefrenseInteraction(msg, i.member);
    } catch (er) {
      i.reply({
        content:
          "There is something was wrong when fetching the data, maybe the title is to loong, so i can't display it\nIf this is a bug, feel free to contact my developer at my support server.",
        ephemeral: true,
      });
      console.log(er.stack);
    }
  },
};
