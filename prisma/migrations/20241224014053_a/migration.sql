-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "channel" TEXT,
    "user" TEXT,
    "reason" TEXT,
    "admin" TEXT,
    "time_nlp" TEXT,
    "time_banned" TIMESTAMP(3),
    "number_of_messages" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "readOnly" BOOLEAN NOT NULL,
    "allowlist" TEXT[],

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bans" (
    "id" SERIAL NOT NULL,
    "user" TEXT,
    "reason" TEXT,
    "admin" TEXT,
    "time" TIMESTAMP(3),

    CONSTRAINT "Bans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slowmode" (
    "id" SERIAL NOT NULL,
    "channel" TEXT,
    "locked" BOOLEAN DEFAULT false,
    "messageCount" INTEGER,
    "time" INTEGER,

    CONSTRAINT "Slowmode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlowUsers" (
    "id" SERIAL NOT NULL,
    "channel" TEXT,
    "user" TEXT,
    "count" INTEGER,
    "banned" BOOLEAN DEFAULT false,
    "whitelist" BOOLEAN DEFAULT false,

    CONSTRAINT "SlowUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SlowUsers_channel_user_key" ON "SlowUsers"("channel", "user");
