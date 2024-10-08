-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "counting_score" INTEGER NOT NULL DEFAULT 0,
    "guild_configId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_guild_configId_fkey" FOREIGN KEY ("guild_configId") REFERENCES "guild_config"("id") ON DELETE SET NULL ON UPDATE CASCADE;
