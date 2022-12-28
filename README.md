#  api-wifi-mexico
## An API that allows you to get data from [Wifi access points in Mexico City](https://datos.cdmx.gob.mx/dataset/puntos-de-acceso-wifi-en-la-ciudad-de-mexico).

## Features

- Provides a paginated list of WiFi access points.
- Allows you to query APs per ID and "colonia".
- Provides a list of the closest APs for two given cordinates.

## How it woks?

| Description | Endpoints |
| ------ | ------ |
| Returns a list of APs, allows using [query parameters](https://en.wikipedia.org/wiki/Query_string) to filter by "colonia" and to move across pages. | [/access-points](localhost:8080/access-points) |
| Returns a list of the [closest APs to a given set of coordinates](https://en.wikipedia.org/wiki/Haversine_formula), allows using [query parameters](https://en.wikipedia.org/wiki/Query_string) to to move across pages. | [/access-points/closest](localhost:8080/access-points/closest?latitud=9&longitud=9)|
| Gives you the data for a given ID, the Dataset IDs are not unique so you can expect multiple resulst for a few ID (yeah... I know...)| [/access-points/ID](localhost:8080/access-points/141) |

Here are a few examples:
```sh
curl "https://api-wifi-mexico-ctfu4tokva-uc.a.run.app/access-points/MC00427"
```
```sh
curl "https://api-wifi-mexico-ctfu4tokva-uc.a.run.app/access-points/closest?latitud=19.3185&longitud=-98.96466"
```
```sh
curl "https://api-wifi-mexico-ctfu4tokva-uc.a.run.app/access-points?colonia=IGNACIO%20ZARAGOZA%20I"
```
```sh
curl "https://api-wifi-mexico-ctfu4tokva-uc.a.run.app/access-points?page=27"
```
```sh
curl "https://api-wifi-mexico-ctfu4tokva-uc.a.run.app/access-points"
```
> This was given to me as a technical assesment for a job position, I generally do not do this kinds of take home assignments but I decided to do it as a side project because... why not?

## Tech
- [node.js] 
- [Express]
- [knex.js]
- [postgreSQL]

## Prerequisites

 Create a postgres table:
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
Import the dataset:
```SQL
COPY access_points(id, programa, fecha_instalacion, latitud, longitud, colonia, alcaldia) 
FROM '/home/.../dataset.csv' DELIMITER ',' CSV HEADER;
```

**Sidenote:**  If you want to use [cloud SQL](https://cloud.google.com/sql) (like I did for the deployement) you should keep in mind that you whould remove the first line from the CSV (the column names) before attemting to [import the CSV](https://cloud.google.com/sql/docs/postgres/import-export/import-export-csv#import_data_from_a_csv_file). In the future, I will write a [Cloud Function](https://cloud.google.com/functions) to do this automatically.

**Sidenote 2:**  It is is my plans to create a [Cloud Build config file](https://cloud.google.com/build/docs/build-config-file-schema) so it this so de deployment and prerequisites are done automatically. A bash script is also in my plans.

Set up the following environment varibles (I know its not safe, I did not have time to use something like [Secret Manager](https://cloud.google.com/secret-manager)):
| env | description |
| ------ | ------ |
|DB_HOST| IP for the database.
|DB_PORT| Port for the database.
|DB_USER| User for the database.
|DB_DATABASE| Database name.
|DB_PASS| Database password.
|DB_TABLE| Table name.

Enable the required [postgres extensions](https://www.postgresql.org/docs/14/earthdistance.html) to compute the  [Harversine Distance](https://en.wikipedia.org/wiki/Haversine_formula):

```SQL
drop extension if exists earthdistance;
drop extension if exists cube;
create extension cube schema pg_catalog;
create extension earthdistance schema pg_catalog;
```
## Installation

Install the dependencies and start the server.
```sh
npm install
node server.js
```
I deployed this on [Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service#deploy) so I don't need to mantain a Dockerfile but it was a requirement for the assesment so...  if you want to use docker here it is:

```sh
docker build . -t NAME
docker run NAME
```

## License

ISC

   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
   [knex.js]: <https://knexjs.org>
   [postgreSQL]: <https://www.postgresql.org>

