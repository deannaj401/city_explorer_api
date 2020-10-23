DROP TABLE if Exists location;


CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    latitude FLOAT8,
    longitude FLOAT8,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255)
);

