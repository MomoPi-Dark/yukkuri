const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");
const Mal = require("mal-scraper");

module.exports = {
  async awaitModelAnime(name) {
    const res = await Mal.getInfoFromName(name);
    const trailer = new MessageButton()
      .setLabel(
        `Trailer ${
          res.title.length ? res.title.substring(0, 70) + "..." : res.title
        }`
      )
      .setStyle("LINK")
      .setEmoji("🎬")
      .setURL(res.trailer || res.url);

    const row = new MessageActionRow().addComponents([trailer]);

    const embed = new MessageEmbed()
      .setColor("ORANGE")
      .setTitle(res.title)
      .setURL(res.url)
      .setThumbnail(res.picture)
      .setDescription(
        res.synopsis.length
          ? res.synopsis.substring(0, 500) + "..."
          : res.synopsis
      )
      .addFields([
        {
          name: "Title",
          value: [
            `**Original:** ${res.title}`,
            `**English:** ${res.englishTitle}`,
            `**Japanese:** ${res.japaneseTitle}`,
          ].join("\n"),
          inline: true,
        },
        {
          name: "Episode",
          value: [
            `**Total Episode:** ${res.episodes}`,
            `**Type:** ${res.type}`,
            `**Aired:** ${res.aired}`,
            `**Premiered:** ${res.premiered}`,
            `**Broadcast:** ${res.broadcast}`,
            `**Studio:** ${res.studios}`,
            `**Status:** ${res.status}`,
          ].join("\n"),
          inline: true,
        },
        {
          name: "Producers",
          value: [res.producers.map((p) => p).join(", ")].join(""),
          inline: true,
        },
        {
          name: "Ratings",
          value: [
            `**Scores:** ${res.score}`,
            `**Rating:** ${res.rating}`,
            `**Genres:** ${res.genres.map((g) => g).join(", ")}`,
            `**Ranked:** ${res.ranked}`,
            `**Fav:** ${res.favorites}`,
            `**Popularity:** ${res.popularity}`,
          ].join("\n"),
        },
      ]);

    return {
      row,
      embed,
    };
  },
};
