const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const flags = {
  DISCORD_EMPLOYEE: "Discord Employee",
  DISCORD_PARTNER: "Discord Partner",
  BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1)",
  BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2)",
  HYPESQUAD_EVENTS: "HypeSquad Events",
  HOUSE_BRAVERY: "House of Bravery",
  HOUSE_BRILLIANCE: "House of Brilliance",
  HOUSE_BALANCE: "House of Balance",
  EARLY_SUPPORTER: "Early Supporter",
  TEAM_USER: "Team User",
  SYSTEM: "System",
  VERIFIED_BOT: "Verified Bot",
  VERIFIED_DEVELOPER: "Verified Bot Developer"
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Show your avatar or user avatar")
    .addSubcommand((sub) =>
      sub
        .setName("info")
        .setDescription("Get discord user info")
        .addUserOption((opt) =>
          opt
            .setName("tag")
            .setDescription("Tag someone to get their userinfo.")
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("avatar")
        .setDescription("Get discord user avatar")
        .addUserOption((opt) =>
          opt.setName("user").setDescription("Tag someone to get their avatar.")
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("roles")
        .setDescription("Get discord user roles")
        .addUserOption((opt) =>
          opt
            .setName("tag")
            .setDescription("Tag someone to get thier roles data.")
        )
    ),
  async execute(i) {
    const opt = i.options.getSubcommand();

    if (opt === "info") {
      const user = i.options.getUser("tag") || i.member;
      const member = i.guild.members.cache.get(user.id);
      const roles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role.toString())
        .slice(0, -1);
      const userFlags = member.user.flags.toArray();
      console.log(member.user.presence);
      const embed = new MessageEmbed()
        .setColor("ORANGE")
        .setThumbnail(member.user.avatarURL({ dynaic: true }))
        .setAuthor({ name: `${member.user.username}'s Information` })
        .addField(
          "Detail Information",
          [
            `**❯ Username:** ${member.user.username}`,
            `**❯ Discriminator:** ${member.user.discriminator}`,
            `**❯ ID:** ${member.id}`,
            `**❯ Flags:** ${
              userFlags.length
                ? userFlags.map((flag) => flags[flag]).join(", ")
                : "None"
            }`,
            `**❯ Time Created:** ${moment(member.user.createdTimestamp).format(
              "LT"
            )} ${moment(member.user.createdTimestamp).format("LL")} ${moment(
              member.user.createdTimestamp
            ).fromNow()}`,
            `**❯ Status:** ${
              member.user.presence
                ? member.user.presence.game
                : "No Game Detected."
            }`,
            `\u200b`
          ].join("\n")
        )
        .addField(
          "Server Information",
          [
            `**❯ Highest Role:** ${
              member.roles.highest.id === i.guild.id
                ? "None"
                : member.roles.highest.name
            }`,
            `**❯ Join To This Server At:** ${moment(member.joinedAt).format(
              "LL LTS"
            )}`,
            `**❯ Roles [${roles.length}]:** ${
              roles.length < 10
                ? roles.join(", ")
                : roles.length > 10
                ? this.client.utils.trimArray(roles)
                : "None"
            }`,
            `\u200b`
          ].join("\n")
        );

      return i.reply({ embeds: [embed] });
    }

    if (opt === "avatar") {
      const user = i.options.getUser("user") || i.member;
      const member = i.guild.members.cache.get(user.id);
      const format = ["png", "jpg", "jpeg", "webp"];
      if (member.avatar && user.avatar.startsWith("a_")) format.push("gif");
      const embed = new MessageEmbed()
        .setAuthor({
          name: `Avatar's ${i.user.tag}`,
          iconURL: i.user.avatarURL()
        })
        .setColor("ORANGE")
        .setDescription(
          format
            .map(
              (x) =>
                `[**${x.toUpperCase()}**](${user.displayAvatarURL({
                  format: x,
                  size: 4096
                })})`
            )
            .join(" | ")
        )
        .setImage(member.user.avatarURL({ dymic: true, size: 4096 }));

      return i.reply({ embeds: [embed] });
    }

    if (opt === "roles") {
      const user = i.options.getUser("tag") || i.member;
      const member = i.guild.members.cache.get(user.id);

      const roles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role.toString())
        .slice(0, -1);

      const embed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle(`${member.user.username}'s Roles Info`)
        .setDescription(
          [
            `**❯ Roles [${roles.length}]:** ${
              roles.length < 10
                ? roles.join(", ")
                : roles.length > 10
                ? this.client.utils.trimArray(roles)
                : "None"
            }`
          ].join("\n")
        );

      return i.reply({ embeds: [embed] });
    }
  }
};
