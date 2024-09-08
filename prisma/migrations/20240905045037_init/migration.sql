-- CreateTable
CREATE TABLE "Reaction" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoJoinRoles" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "AutoJoinRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationChannel" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,

    CONSTRAINT "ModerationChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationChannelSettings" (
    "id" SERIAL NOT NULL,
    "deleted_message" BOOLEAN NOT NULL DEFAULT true,
    "edited_message" BOOLEAN NOT NULL DEFAULT true,
    "user_left" BOOLEAN NOT NULL DEFAULT true,
    "user_join" BOOLEAN NOT NULL DEFAULT true,
    "user_ban" BOOLEAN NOT NULL DEFAULT true,
    "user_timeout" BOOLEAN NOT NULL DEFAULT true,
    "user_kick" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ModerationChannelSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelSettings" (
    "id" SERIAL NOT NULL,
    "guid_id" TEXT NOT NULL,
    "channel_id_reddit_posts" TEXT,
    "subreddits" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "ChannelSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedditPosts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "guiid_id" TEXT NOT NULL,
    "reddit_id" TEXT NOT NULL,

    CONSTRAINT "RedditPosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModerationChannel_id_key" ON "ModerationChannel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationChannel_guild_id_key" ON "ModerationChannel"("guild_id");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationChannelSettings_id_key" ON "ModerationChannelSettings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_id_key" ON "ChannelSettings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_guid_id_key" ON "ChannelSettings"("guid_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSettings_channel_id_reddit_posts_key" ON "ChannelSettings"("channel_id_reddit_posts");

-- CreateIndex
CREATE UNIQUE INDEX "RedditPosts_id_key" ON "RedditPosts"("id");

-- AddForeignKey
ALTER TABLE "ModerationChannel" ADD CONSTRAINT "ModerationChannel_id_fkey" FOREIGN KEY ("id") REFERENCES "ModerationChannelSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
