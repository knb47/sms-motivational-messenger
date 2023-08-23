CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "phone_number" varchar,
  "time_zone" varchar
);

CREATE TABLE "messages" (
  "id" serial PRIMARY KEY,
  "message" varchar
);