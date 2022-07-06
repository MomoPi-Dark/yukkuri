const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v9");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hell")
    .setDescription("Send member to the hell 👹")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("Tag user").setRequired(true)
    )
    .addBooleanOption((opt) =>
      opt
        .setName("choices")
        .setDescription(
          "(True) To send the user to hell, (False) To remove the user from hell"
        )
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(i) {
    if (!i.member.permissions.has(["MANAGE_GUILD"])) {
      return i.reply({
        content: "You have no permissions to run this command",
        ephemeral: true
      });
    }

    const role = i.guild.roles.cache.get("994104071097171968");
    const user = i.options.getUser("user");
    const member = i.guild.members.cache.get(user.id);
    const opt = i.options.getBoolean("choices");

    if (opt) {
      member.roles.add(role);
      return i.reply(`${user} Has been send to the hell!`);
    }

    member.roles.remove(role);
    return i.reply(`${user} Has been removed from the hell!`);
  }
};
