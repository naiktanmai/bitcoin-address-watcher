#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER btcwatcher;
	CREATE DATABASE btcwatcherdb;
	GRANT ALL PRIVILEGES ON DATABASE btcwatcherdb TO btcwatcher;
EOSQL