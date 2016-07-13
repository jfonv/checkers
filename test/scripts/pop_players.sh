#!/bin/bash

mongoimport --jsonArray --drop --db $DB --collection players --file ../data/players.json
