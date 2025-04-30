/*
  Warnings:

  - You are about to drop the column `guild_id` on the `AutoJoinRoles` table. All the data in the column will be lost.
  - You are about to drop the column `channel_id_members` on the `ChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `channel_id_offline` on the `ChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `channel_id_online` on the `ChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `channel_id_reddit_posts` on the `ChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `guid_id` on the `ChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `join_messages` on the `ChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `subreddits_interval_hours` on the `ChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `channel_id` on the `ModerationChannel` table. All the data in the column will be lost.
  - You are about to drop the column `guild_id` on the `ModerationChannel` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_message` on the `ModerationChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `edited_message` on the `ModerationChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `user_ban` on the `ModerationChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `user_join` on the `ModerationChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `user_kick` on the `ModerationChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `user_left` on the `ModerationChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `user_timeout` on the `ModerationChannelSettings` table. All the data in the column will be lost.
  - You are about to drop the column `guild_id` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `message_id` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `guiid_id` on the `RedditPosts` table. All the data in the column will be lost.
  - You are about to drop the column `reddit_id` on the `RedditPosts` table. All the data in the column will be lost.
  - You are about to drop the column `counting_score` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `guild_configId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `balance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `counting_game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `guild_config` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `level` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `poll_votes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[guildId]` on the table `ChannelSettings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channelIdRedditPosts]` on the table `ChannelSettings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channelIdMembers]` on the table `ChannelSettings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channelIdOnline]` on the table `ChannelSettings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channelIdOffline]` on the table `ChannelSettings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guildId]` on the table `ModerationChannel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[moderationChannelSettingsId]` on the table `ModerationChannel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[moderationChannelId]` on the table `ModerationChannelSettings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `guildId` to the `AutoJoinRoles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guildId` to the `ChannelSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `ModerationChannel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guildId` to the `ModerationChannel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderationChannelSettingsId` to the `ModerationChannel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderationChannelId` to the `ModerationChannelSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guildId` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageId` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guildId` to the `RedditPosts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `redditId` to the `RedditPosts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discordId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guildId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ModerationChannel" DROP CONSTRAINT "ModerationChannel_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_guild_configId_fkey";

-- DropIndex
DROP INDEX "ChannelSettings_channel_id_members_key";

-- DropIndex
DROP INDEX "ChannelSettings_channel_id_offline_key";

-- DropIndex
DROP INDEX "ChannelSettings_channel_id_online_key";

-- DropIndex
DROP INDEX "ChannelSettings_channel_id_reddit_posts_key";

-- DropIndex
DROP INDEX "ChannelSettings_guid_id_key";

-- DropIndex
DROP INDEX "ChannelSettings_id_key";

-- DropIndex
DROP INDEX "ChannelSettings_join_messages_key";

-- DropIndex
DROP INDEX "ModerationChannel_guild_id_key";

-- DropIndex
DROP INDEX "ModerationChannel_id_key";

-- DropIndex
DROP INDEX "ModerationChannelSettings_id_key";

-- DropIndex
DROP INDEX "RedditPosts_id_key";

-- AlterTable
ALTER TABLE "AutoJoinRoles" DROP COLUMN "guild_id",
ADD COLUMN     "guildId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChannelSettings" DROP COLUMN "channel_id_members",
DROP COLUMN "channel_id_offline",
DROP COLUMN "channel_id_online",
DROP COLUMN "channel_id_reddit_posts",
DROP COLUMN "guid_id",
DROP COLUMN "join_messages",
DROP COLUMN "subreddits_interval_hours",
ADD COLUMN     "channelIdMembers" TEXT,
ADD COLUMN     "channelIdOffline" TEXT,
ADD COLUMN     "channelIdOnline" TEXT,
ADD COLUMN     "channelIdRedditPosts" TEXT,
ADD COLUMN     "guildId" TEXT NOT NULL,
ADD COLUMN     "joinMessages" TEXT,
ADD COLUMN     "subredditsIntervalHours" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "ModerationChannel" DROP COLUMN "channel_id",
DROP COLUMN "guild_id",
ADD COLUMN     "channelId" TEXT NOT NULL,
ADD COLUMN     "guildId" TEXT NOT NULL,
ADD COLUMN     "moderationChannelSettingsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ModerationChannelSettings" DROP COLUMN "deleted_message",
DROP COLUMN "edited_message",
DROP COLUMN "user_ban",
DROP COLUMN "user_join",
DROP COLUMN "user_kick",
DROP COLUMN "user_left",
DROP COLUMN "user_timeout",
ADD COLUMN     "deletedMessage" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "editedMessage" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "moderationChannelId" INTEGER NOT NULL,
ADD COLUMN     "userBan" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "userJoin" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "userKick" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "userLeft" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "userTimeout" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "guild_id",
DROP COLUMN "message_id",
ADD COLUMN     "guildId" TEXT NOT NULL,
ADD COLUMN     "messageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RedditPosts" DROP COLUMN "guiid_id",
DROP COLUMN "reddit_id",
ADD COLUMN     "guildId" TEXT NOT NULL,
ADD COLUMN     "redditId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "counting_score",
DROP COLUMN "guild_configId",
DROP COLUMN "user_id",
ADD COLUMN     "countingScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "discordId" TEXT NOT NULL,
ADD COLUMN     "guildId" TEXT NOT NULL;

-- DropTable
DROP TABLE "balance";

-- DropTable
DROP TABLE "counting_game";

-- DropTable
DROP TABLE "guild_config";

-- DropTable
DROP TABLE "level";

-- DropTable
DROP TABLE "poll_votes";

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildConfig" (
    "id" SERIAL NOT NULL,
    "rankupMessages" BOOLEAN NOT NULL DEFAULT false,
    "joinMessages" BOOLEAN NOT NULL DEFAULT false,
    "bannedWords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "guildId" TEXT NOT NULL,

    CONSTRAINT "GuildConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollVotes" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "upMembers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "downMembers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PollVotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountingGame" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "lastPersonId" TEXT,

    CONSTRAINT "CountingGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildConfig_guildId_key" ON "GuildConfig"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "CountingGame_channelId_key" ON "CountingGame"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_guildId_key" ON "ChannelSettings"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_channelIdRedditPosts_key" ON "ChannelSettings"("channelIdRedditPosts");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_channelIdMembers_key" ON "ChannelSettings"("channelIdMembers");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_channelIdOnline_key" ON "ChannelSettings"("channelIdOnline");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_channelIdOffline_key" ON "ChannelSettings"("channelIdOffline");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationChannel_guildId_key" ON "ModerationChannel"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationChannel_moderationChannelSettingsId_key" ON "ModerationChannel"("moderationChannelSettingsId");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationChannelSettings_moderationChannelId_key" ON "ModerationChannelSettings"("moderationChannelId");

-- AddForeignKey
ALTER TABLE "GuildConfig" ADD CONSTRAINT "GuildConfig_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollVotes" ADD CONSTRAINT "PollVotes_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollVotes" ADD CONSTRAINT "PollVotes_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountingGame" ADD CONSTRAINT "CountingGame_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountingGame" ADD CONSTRAINT "CountingGame_lastPersonId_fkey" FOREIGN KEY ("lastPersonId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationChannel" ADD CONSTRAINT "ModerationChannel_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationChannel" ADD CONSTRAINT "ModerationChannel_moderationChannelSettingsId_fkey" FOREIGN KEY ("moderationChannelSettingsId") REFERENCES "ModerationChannelSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoJoinRoles" ADD CONSTRAINT "AutoJoinRoles_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelSettings" ADD CONSTRAINT "ChannelSettings_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedditPosts" ADD CONSTRAINT "RedditPosts_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
