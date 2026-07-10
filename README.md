
#  api-wifi-mexico
## An API that allows you to get data from [Wifi access points in Mexico City](https://datos.cdmx.gob.mx/dataset/puntos-de-acceso-wifi-en-la-ciudad-de-mexico).

## What and Why

This was given to me as a technical assessment for a job position back in Dec 2022, I generally do not do this kinds of take home assignments but I decided to do it as a side project because it was my winter vacation and I was bored.

Originally it was running on [Cloud Run ](https://cloud.google.com/run) and [Cloud SQL](https://cloud.google.com/sql) because it had to run on a container, and did not felt like setting up a VM from scratch and write the instructions. It also used a database because it was a requirement, a Cloud SQL instance for a CSV is a waste TBH.

I did not accepted the job due the offer not being compiling for me. 

As of 2026 I updated it to have some infra project to show up, the following has changed:

- Now everything runs on container, the DB, the Backend, and NGINX.
- HTTPS support on NGINX, which was not needed when this was already provided by Cloud Run.
- Uses docker compose so now you can deploy it on one command.
- Added a health-check endpoint to have each container depend on their dependencies to be ready.
- The original dataset is not available anymore so I asked an LLM to generate some dummy dataset with 40 endpoints.
- I have startup scripts for Postgres to create the db and install any required extensions.


## How it woks?

Update 2026, I should add a small Swagger file

| Description                                                                                                                                                                                                              | Endpoints              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| Returns a list of APs, allows using [query parameters](https://en.wikipedia.org/wiki/Query_string) to filter by "colonia" and to move across pages.                                                                      | /access-points         |
| Returns a list of the [closest APs to a given set of coordinates](https://en.wikipedia.org/wiki/Haversine_formula), allows using [query parameters](https://en.wikipedia.org/wiki/Query_string) to to move across pages. | /access-points/closest |
| Gives you the data for a given ID, the original Dataset IDs were not unique so you can expect multiple resulst for a few ID (yeah... I know...)<br>                                                                      | /access-points/{ID}    |

Here are a few examples:
```sh
curl "https://host/access-points/MC00427"
```
```sh
curl "https://host/access-points/closest?latitud=19.3185&longitud=-98.96466"
```
```sh
curl "https://host/access-points?colonia=IGNACIO%20ZARAGOZA%20I"
```
```sh
curl "https://host/access-points?page=2"
```
```sh
curl "https://host/access-points"
```
## What did I used
- node.js
- Express
- knex.js
- postgreSQL
- Docker
- Docker compose
- NGINX

## Some info that might not be needed anymore

### Table

```SQL
CREATE TABLE access_points (
  id VARCHAR(255) not null,
  programa VARCHAR(255) not null,
  fecha_instalacion DATE not null,
  latitud FLOAT not null,
  longitud FLOAT not null,
  colonia VARCHAR(255) not null,
  alcaldia VARCHAR(255) not null
);
```

### Environment variables

| env | description |
| ------ | ------ |
|DB_HOST| IP for the database.
|DB_PORT| Port for the database.
|DB_USER| User for the database.
|DB_DATABASE| Database name.
|DB_PASS| Database password.
|DB_TABLE| Table name.
|POSTGRES_DB| Table name for postgress.
|POSTGRES_PASSWORD| The postgress password.
|POSTGRES_USER| The postgress User.

I enabled the [postgres extensions](https://www.postgresql.org/docs/14/earthdistance.html) to compute the  [Harversine Distance](https://en.wikipedia.org/wiki/Haversine_formula):

```SQL
drop extension if exists earthdistance;
drop extension if exists cube;
create extension cube schema pg_catalog;
create extension earthdistance schema pg_catalog;
```

## Installation

Add your password on `DB_PASS` and `POSTGRES_PASSWORD` env's.

Put your ssl certificates on the `./certs directory`. I use self signed as I would put it behind a WAF/CDN.

```bash
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout certs/server.key \
  -out certs/server.crt \
  -config certs/openssl.cnf \
  -extensions req_ext
```

Run it.

```bash
docker compose up -d
```


## License

Do what you want with this, but don't feed it into AI for training/use it as a training data for AI.
