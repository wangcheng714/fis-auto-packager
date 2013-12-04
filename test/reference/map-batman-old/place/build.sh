#!/bin/bash
# add path
export PATH=/home/fis/npm/bin: $PATH
#show fis-pc version
fisp --version --no-color
#use --unique option
fisp release -Domupd output --no-color 