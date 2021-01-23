# `Sizabl.io` Gallery Service

## Related Projects

- https://github.com/Sizabl-io/review-service
- https://github.com/Sizabl-io/calendar-reservations
- https://github.com/Sizabl-io/people-also-viewed

## Installing Dependencies

- [PostgreSQL](https://www.postgresql.org/download/)
- Postgres credentials file in the postgres-db file, see `postgres-db/index.js` for more details.
- New Relic configuration file in root directory.

From within the root directory:

```sh
npm i -g webpack
npm i
```

## Usage

- `npm run seed` will generate mock data CSV files according to `numRecords` and
  `numDocuments` within seed.js. Adjust Node's allocated RAM within package.json as needed.
- Load the CSV files into the database within the postgres-db folder: `psql -U postgres -h 127.0.0.1 -f photo-gallery-schema.sql`
- Start the server using `npm start`
- Start the client using `npm run react-dev` or `npm run react`

</br>

## _Restaurant API_

</br>

### Get restaurant information by restaurant id

- GET `/api/restaurants/:id`

**Path Parameters:**

- `id` - restaurant id

**Success Status Code:** `200`

**Returns:** JSON

```json
{
  "restaurant_id": "Number",
  "restaurant_name": "String",
  "site_url": "String",
  "phone_number": "String",
  "city": "String",
  "street": "String",
  "state_or_province": "Number",
  "country": "String",
  "zip": "String"
}
```

</br>

## _Gallery API_

</br>

### Select all photos matching restaurant ID

- GET `/api/galleries/:id`

**Path Parameters:**

- `id` - restaurant id

**Success Status Code:** `200`

**Returns:** Array of JSON photo objects

```json
{
  "photo_id": "Number",
  "restaurant_id": "Number",
  "user_id": "Number",
  "helpful_count": "Number",
  "not_helpful_count": "Number",
  "photo_url": "String",
  "caption": "String",
  "upload_date": "String"
}
```

</br>

## _Photo API_

</br>

### Add a photo

- POST `/api/photos`

**Success Status Code:** `201`

**Request Body**: Expects JSON with the following keys.

```json
{
  "restaurant_id": "Number",
  "user_id": "Number",
  "helpful_count": "Number",
  "not_helpful_count": "Number",
  "photo_url": "String",
  "upload_date": "String",
  "caption": "String"
}
```

### Delete photos matching photo id

- DELETE `/api/photos/:id`

**Path Parameters:**

- `id` - photo id

**Success Status Code:** `200`

</br>
