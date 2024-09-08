/*
  Warnings:

  - A unique constraint covering the columns `[channel_id_members]` on the table `ChannelSettings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channel_id_online]` on the table `ChannelSettings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channel_id_offline]` on the table `ChannelSettings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[join_messages]` on the table `ChannelSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ChannelSettings" ADD COLUMN     "channel_id_members" TEXT,
ADD COLUMN     "channel_id_offline" TEXT,
ADD COLUMN     "channel_id_online" TEXT,
ADD COLUMN     "join_messages" TEXT,
ADD COLUMN     "subreddits_interval_hours" INTEGER NOT NULL DEFAULT 3;

-- CreateTable
CREATE TABLE "guild_config" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "rankup_messages" BOOLEAN DEFAULT false,
    "join_messages" BOOLEAN DEFAULT false,
    "bannedWords" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "guild_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_votes" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "up_members" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "down_members" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "poll_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balance" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "counting_game" (
    "id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "last_person_id" TEXT NOT NULL,

    CONSTRAINT "counting_game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "level_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guild_config_guild_id_key" ON "guild_config"("guild_id");

-- CreateIndex
CREATE UNIQUE INDEX "counting_game_channel_id_key" ON "counting_game"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_channel_id_members_key" ON "ChannelSettings"("channel_id_members");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_channel_id_online_key" ON "ChannelSettings"("channel_id_online");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_channel_id_offline_key" ON "ChannelSettings"("channel_id_offline");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_join_messages_key" ON "ChannelSettings"("join_messages");
