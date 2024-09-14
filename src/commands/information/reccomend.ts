import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  DMChannel,
  EmbedBuilder,
  NewsChannel,
  StringSelectMenuBuilder,
  TextChannel,
} from "discord.js";
import { CommandData, CommandOptions, SlashCommandProps } from "../../handler";

export const data: CommandData = {
  name: "reccomend",
  description: "reccomend a game to play",
  options: [
    {
      name: "game",
      description: "the game to reccomend",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export async function run({ interaction, client, handler }: SlashCommandProps) {
  const igdb = client.igdb;
  const game = interaction.options.getString("game", true);

  try {
    const reccomend = await igdb.search(game);
    if (reccomend.length === 0) {
      return await interaction.reply({
        content: `No recommendation found for ${game}`,
        ephemeral: true,
      });
    }

    // Create a select menu with the search results
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("game_select")
      .setPlaceholder("Choose a game")
      .addOptions(
        reccomend.slice(0, 5).map((g) => ({
          label: `${g.name} - (${new Date(
            g.first_release_date * 1000
          ).getFullYear()})`,
          value: g.id.toString(),
        }))
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu
    );

    // Send a reply with the dropdown menu
    const message = await interaction.reply({
      content: `Select a game to get more details:`,
      components: [row],
      ephemeral: true,
    });

    try {
      // Await the user's selection from the dropdown
      const confirmation = await message.awaitMessageComponent({
        time: 60000,
        filter: (i) => i.user.id === interaction.user.id,
      });

      // If not a StringSelectMenu, return early
      if (!confirmation.isStringSelectMenu()) {
        return;
      }

      const selectedGameId = confirmation.values[0];
      const selectedGame = await igdb.info(selectedGameId);

      // Handle the select menu interaction and send back a fancy embed with the game details
      const embed = new EmbedBuilder()
        .setAuthor({
          name: selectedGame.name,
          url: selectedGame.url,
        })
        .setDescription(selectedGame.summary || "No summary available")
        .setThumbnail(
          selectedGame.cover?.url.startsWith("http")
            ? selectedGame.cover.url
            : `https:${selectedGame.cover.url}` || ""
        )
        .addFields(
          {
            name: "Release Date",
            value: selectedGame.release_dates?.[0]?.human || "Unknown",
            inline: true,
          },
          {
            name: "Genres",
            value:
              selectedGame.genres?.map((g) => g.name).join(", ") || "Unknown",
            inline: true,
          },
          {
            name: "Platforms",
            value:
              selectedGame.platforms?.map((p) => p.name).join(", ") ||
              "Unknown",
            inline: true,
          }
        )
        .setFooter({
          text: `${interaction.user.username} suggested ${
            selectedGame?.name ?? game ?? "unknown"
          }`,
        })
        .setTimestamp()
        .setColor(client.config.color);

      // Early return if channel cannot send messages
      if (
        !(
          interaction.channel instanceof TextChannel ||
          interaction.channel instanceof DMChannel ||
          interaction.channel instanceof NewsChannel
        )
      ) {
        console.error(
          "Unsupported channel type for sending recommend message."
        );
        return;
      }

      await confirmation.deferUpdate();

      await confirmation.followUp({
        content: `${interaction.user} has suggested you to play ${
          selectedGame.name ?? game
        }`,
        embeds: [embed],
      });
    } catch (error) {
      console.error("Interaction timed out", error);
      return await interaction.editReply({
        content: "Timed out while waiting for a selection. Please try again.",
        components: [], // Clear the dropdown if no selection was made
      });
    }
  } catch (error) {
    console.error(error);
    return await interaction.reply({
      content: `An error occurred while searching for ${game}. Please try again later.`,
      ephemeral: true,
    });
  }
}

export const options: CommandOptions = {
  devOnly: false,
  deleted: false,
};
