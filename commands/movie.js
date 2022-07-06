const { SlashCommandBuilder } = require("@discordjs/builders");
const Axios = require("axios");
const tmdb = require("../tmdb/getMovie");
const BASE_URL = "https://api.themoviedb.org/3";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("movie")
    .setDescription("Get movie details from TMDB.")
    .addStringOption((opt) =>
      opt
        .setName("name")
        .setDescription("Insert the movie name")
        .setRequired(true)
    ),
  async execute(i) {
    try {
      await i.deferReply().catch((er) => er);
      i.deleteReply();
      const name = i.options.getString("name");
      const res = await Axios(
        `${BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${name}`
      );
      const data = res.data;

      tmdb.getMovieDetails(data, i);
    } catch (er) {
      i.reply({
        content:
          "There is something was wrong when fetching movie data\nFeel free to contact my developer at my support server.",
        ephemeral: true
      });
      console.error(er.stack);
    }
  }
};
