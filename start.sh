#!/bin/bash
mkdir -p server/dbs/generated/postgres/{photos,restaurants,users} &
npm run react &
npm run seed &
npm start