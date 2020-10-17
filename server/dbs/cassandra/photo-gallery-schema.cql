DROP KEYSPACE IF EXISTS gallery;
CREATE KEYSPACE gallery
WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

-- general info about a restaurant/merchant
CREATE TABLE gallery.restaurant (
  -- restaurant info
  restaurant_id int PRIMARY KEY,
  site_url text, -- optional
  restaurant_name text, -- required
  phone_number text, -- optional

  -- location info
  location_id int, -- required
  city text, -- required
  street text, -- optional
  state_or_province text, -- optional
  country text, -- optional
  zip text, -- optional
) WITH comment = 'Q1. General info about a restaurant';

-- photos associated with a restaurant
CREATE TABLE gallery.photos_by_restaurant (
  restaurant_id int,

  -- photo info
  photo_id int, -- should be unique to photo
  photo_url text, -- url of photo
  upload_date timestamp, -- optional, auto generated if not provided
  helpfulCount int, -- photo helpful count
  notHelpfulCount int, -- photo not helpful count
  caption text, -- photo caption

  -- user info
  user_id int,
  user_url text, -- profile of user that uploaded
  user_name text, -- user's full name
  user_elite_status boolean, -- whether user is elite
  user_review_count int, -- number of user's reviews
  user_friend_count int, -- number of user's friends
  user_photo_count int, -- number of user's photos
  PRIMARY KEY (photo_id, restaurant_id)
) WITH comment = 'Q2. Find photos by restaurant id'
AND CLUSTERING ORDER BY (restaurant_id ASC); -- cluster photos with same restaurant id