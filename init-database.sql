CREATE SCHEMA licenses;
CREATE SCHEMA wordpress;

-- GRANT ALL PRIVILEGES ON *.* TO 'developer'@'localhost' IDENTIFIED BY 'leadsoft';
GRANT ALL PRIVILEGES ON *.* TO 'licenses'@'localhost' IDENTIFIED BY 'leadsoft';

CREATE DATABASE licenses;
GRANT ALL PRIVILEGES ON *.* TO 'developer'@'%' IDENTIFIED BY 'leadsoft';
