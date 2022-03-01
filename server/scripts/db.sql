CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


create table users ("id" varchar UNIQUE PRIMARY KEY, "wallet" varchar, "discord" varchar , "signed" varchar, "updatedAt" timestamp with time zone, "createdAt" timestamp with time zone);


create table creatures ("id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY, "aurah" integer DEFAULT 0, "domain" varchar , "class" varchar , "updatedAt" timestamp with time zone, "createdAt" timestamp with time zone);


create table quests ("id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY, "rewardType" integer DEFAULT 0, "status" integer DEFAULT 0, "creatureId" uuid references creatures(id), "updatedAt" timestamp with time zone, "createdAt" timestamp with time zone);