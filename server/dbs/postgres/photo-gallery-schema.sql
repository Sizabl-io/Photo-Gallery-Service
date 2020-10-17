DROP DATABASE IF EXISTS gallery;
CREATE DATABASE gallery;

DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS restaurants;

-- restaurants table
CREATE TABLE "restaurants" (
  "id" SERIAL PRIMARY KEY,
  -- general restaurant info
  "name" varchar(100) NOT NULL,
  "site_url" varchar(255),
  "phone_number" varchar(11),

  -- gallery info
  "gallery_id" int UNIQUE,

  -- location info
  "street" varchar(100),
  "city" varchar(100) NOT NULL,
  "state_or_province" varchar(30),
  "country" varchar(20) NOT NULL,
  "zip" varchar(15)
);

-- users who uploaded photos
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "user_url" varchar(255) NOT NULL, -- url of user's profile
  "user_name" varchar(100) NOT NULL, -- user's full name
  "user_review_count" smallint DEFAULT 0, -- number of user's reviews
  "user_friend_count" smallint DEFAULT 0, -- number of user's friends
  "user_photo_count" smallint DEFAULT 0, -- number of user's photos
  "user_elite_status" boolean DEFAULT false -- whether user is elite
);

-- photos table grouped by gallery id
CREATE TABLE "photos" (
  "id" SERIAL PRIMARY KEY,
  "gallery_id" int REFERENCES restaurants(gallery_id) NOT NULL,
  "user_id" int REFERENCES users(id) UNIQUE NOT NULL,
  "helpfulCount" int DEFAULT 0, -- helpful rating of photo
  "notHelpfulCount" int DEFAULT 0, -- not helpful rating of photo
  "photo_url" varchar(255) UNIQUE NOT NULL,
  "caption" text,
  "upload_date" timestamp DEFAULT (now())
);