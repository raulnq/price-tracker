CREATE SCHEMA IF NOT EXISTS "price_tracker";
CREATE TABLE "price_tracker"."stores" (
	"storeid" uuid PRIMARY KEY NOT NULL,
	"name" varchar(1024) NOT NULL,
	"url" varchar(2048) NOT NULL
);
