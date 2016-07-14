#!/bin/bash

mongoimport --jsonArray --drop --db $DB --collection players --file ../data/players.json
mongoimport --jsonArray --drop --db $DB --collection games --file ../data/games.json
