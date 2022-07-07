const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  CommandInteraction,
  MessageSelectMenu,
} = require("discord.js");
const Mal = require("mal-scraper");
const GetRefrense = require("../mal/getRefrense");
const GetSeason = require("../mal/getSeason");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anime")
    .setDescription("Search your fav anime achording from MAl")
    .addSubcommand((sub) =>
      sub
        .setName("search")
        .setDescription("Search anime on MAL")
        .addStringOption((opt) =>
          opt
            .setName("name")
            .setDescription("Anime name you want to search")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("season")
        .setDescription("Get anime season")
        .addNumberOption((opt) =>
          opt
            .setName("year")
            .setDescription("Anime year season")
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("season")
            .setDescription("Anime season, choice here")
            .addChoices(
              { name: "spring", value: "spring" },
              { name: "summer", value: "summer" },
              { name: "fall", value: "fall" },
              { name: "winter", value: "winter" }
            )
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("type")
            .setDescription("Anime season type, default is TV")
            .addChoices(
              { name: "TV", value: "TV" },
              { name: "TVNews", value: "TVNews" },
              { name: "TVCon", value: "TVCon" },
              { name: "ONAs", value: "ONAs" },
              { name: "OVAs", value: "OVAs" },
              { name: "Specials", value: "Specials" },
              { name: "Movies", value: "Movies" }
            )
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("refrense")
        .setDescription("Get recommand anime")
        .addStringOption((opt) =>
          opt
            .setName("refrense")
            .setDescription("Anime reference")
            .setRequired(true)
        )
    ),

  /**
   * @param {CommandInteraction} i
   */
  async execute(i) {
    const opt = i.options.getSubcommand();

    if (opt === "search") {
      const name = i.options.getString("name");
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

      i.reply({ embeds: [embed], components: [row] });
    }

    if (opt === "season") {
      await i.deferReply().catch((er) => er);
      i.deleteReply();
      const seasonList = ["spring", "fall", "summer", "winter"];
      const typeList = [
        "TV",
        "TVNews",
        "TVCon",
        "ONAs",
        "OVAs",
        "Specials",
        "Movies",
      ];
      const year = i.options.getNumber("year");
      const season = i.options.getString("season");
      const type = i.options.getString("type") || "TV";

      if (!seasonList.includes(season)) {
        return i.reply({
          content: "The season is doesn't exist",
          ephemeral: true,
        });
      }

      if (!typeList.includes(type)) {
        return i.reply({
          content: "The season type is doesn't exist",
          ephemeral: true,
        });
      }

      try {
        const res = await Mal.getSeason(year, season, type);
        GetSeason.MalSeason(res, i);
      } catch (er) {
        i.reply({ content: er.message, ephemeral: true });
        console.error(er.stack);
      }
    }

    if (opt === "refrense") {
      const names = i.options.getString("refrense");

      try {
        const name = await Mal.getRecommendationsList(names);
        GetRefrense.MalRefrense(name, i);
      } catch (error) {
        i.reply({ content: error.message, ephemeral: true });
        console.error(error.stack);
      }
    }
  },
};
