COPY access_points(
  id,
  programa,
  fecha_instalacion,
  latitud,
  longitud,
  colonia,
  alcaldia
)
FROM '/data/dataset.csv'
DELIMITER ','
CSV HEADER;
