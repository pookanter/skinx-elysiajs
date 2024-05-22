#!/bin/bash

# Read the JSON file
data=$(jq -c . < mock.json)

# # Make the HTTP POST request
curl -X POST -H "Content-Type: application/json" -d "$data" http://localhost:8080/posts/migrate