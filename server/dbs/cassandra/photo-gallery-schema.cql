DROP KEYSPACE IF EXISTS gallery;
CREATE KEYSPACE gallery
WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

-- general info about a restaurant/merchant
CREATE TABLE gallery.restaurants (
  -- restaurant info
  restaurant_id uuid,
  site_url text, -- optional
  restaurant_name text, -- required
  phone_number text, -- optional

  -- location info
  city text, -- required
  street text, -- optional
  state_or_province text, -- optional
  country text, -- optional
  zip text, -- optional
  PRIMARY KEY (restaurant_id) -- partition by restaurant id
) WITH comment = 'Q1. General info about a restaurant';

-- photos associated with a restaurant
CREATE TABLE gallery.photos_by_restaurant (
  restaurant_id uuid,

  -- photo info
  photo_id uuid, -- should be unique to photo
  photo_url text, -- url of photo
  upload_date text, -- optional, auto generated if not provided
  helpfulCount smallint, -- photo helpful count
  notHelpfulCount smallint, -- photo not helpful count
  caption text, -- photo caption

  -- user info
  user_id uuid,
  user_url text, -- profile of user that uploaded
  user_name text, -- user's full name
  user_elite_status boolean, -- whether user is elite
  user_review_count smallint, -- number of user's reviews
  user_friend_count smallint, -- number of user's friends
  user_photo_count smallint, -- number of user's photos
  PRIMARY KEY (restaurant_id, photo_id)
) WITH comment = 'Q2. Find photos by restaurant id'
AND CLUSTERING ORDER BY (photo_id ASC); -- cluster by photo id, partitioning on restaurant id