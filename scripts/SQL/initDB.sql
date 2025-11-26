CREATE EXTENSION IF NOT EXISTS postgis;

DROP TABLE IF EXISTS user_account CASCADE;
CREATE TABLE user_account (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  mail_address VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

DROP TABLE IF EXISTS vehicle CASCADE;
CREATE TABLE vehicle (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS category CASCADE;
CREATE TABLE category (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_name VARCHAR(150) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS transport_location CASCADE;
CREATE TABLE transport_location (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category_id INTEGER NOT NULL REFERENCES category(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  vehicle_id INTEGER NULL REFERENCES vehicle(id) ON UPDATE CASCADE ON DELETE SET NULL,
  address VARCHAR(255),
  coord geometry(Point, 4326)
);

DROP TABLE IF EXISTS favorite CASCADE;
CREATE TABLE favorite (
  user_account_id INTEGER NOT NULL REFERENCES user_account(id) ON DELETE CASCADE ON UPDATE CASCADE,
  transport_location_id INTEGER NOT NULL REFERENCES transport_location(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (user_account_id, transport_location_id)
);


/* 
Insertion d'utilisateur pour les tests
*/
INSERT INTO user_account (first_name, last_name, mail_address, password, is_admin)
VALUES
('Admin1', 'Admin1', 'Admin1@mail.com', 'root', TRUE),
('Mathias', 'Van der Cuylen', 'Mathias@mail.com', 'password123', FALSE);

/* 
Création des catégories
*/
INSERT INTO category (category_name)
VALUES 
('Gare de train'),
('Arret de bus');
