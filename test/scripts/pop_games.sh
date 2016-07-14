#!/bin/bash

mongoimport --jsonArray --drop --db $DB --collection games --file ../data/games.json
