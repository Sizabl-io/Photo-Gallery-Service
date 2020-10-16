DROP DATABASE IF EXISTS gallery;
CREATE DATABASE gallery;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS merchants;
DROP TABLE IF EXISTS services;

-- services table
CREATE TABLE "services" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int UNIQUE NOT NULL,
  "gallery_id" int UNIQUE,
  "location_id" int UNIQUE NOT NULL
);

-- merchant info
CREATE TABLE "merchants" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "site_url" varchar(255),
  "phone_number" varchar(11)
);

-- photo gallery containing individual photos
CREATE TABLE "photos" (
  "id" SERIAL PRIMARY KEY,
  "gallery_id" int NOT NULL,
  "user_id" int UNIQUE NOT NULL,
  "helpfulCount" int DEFAULT 0, -- helpful rating of photo
  "notHelpfulCount" int DEFAULT 0, -- not helpful rating of photo
  "photo_url" varchar(255) UNIQUE NOT NULL,
  "caption" text,
  "upload_date" timestamp DEFAULT (now())
);

-- users who uploaded photos
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "user_url" varchar(255) NOT NULL, -- url of user's profile
  "user_name" varchar(100) NOT NULL, -- user's full name
  "user_review_count" smallint DEFAULT 0, -- number of user's reviews
  "user_friend_count" smallint DEFAULT 0, -- number of user's friends
  "user_photo_count" smallint DEFAULT 0 -- number of user's photos
);

-- location info to connect gallery users with nearby services
CREATE TABLE "locations" (
  "id" SERIAL PRIMARY KEY,
  "street" varchar(100),
  "city" varchar(255) NOT NULL,
  "state_or_province" varchar(255),
  "country" varchar(255) NOT NULL,
  "zip" varchar(15)
);


ALTER TABLE "locations" ADD FOREIGN KEY ("id") REFERENCES "services" ("location_id");

ALTER TABLE "merchants" ADD FOREIGN KEY ("id") REFERENCES "services" ("merchant_id");

ALTER TABLE "photos" ADD FOREIGN KEY ("gallery_id") REFERENCES "services" ("gallery_id");

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "photos" ("user_id");