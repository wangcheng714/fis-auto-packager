#!/bin/bash
# add path
set -e
export PATH=/home/fis/npm/bin:$PATH
#show fis-pc version
fisp --version --no-color
#use --unique option
fisp release -Domupld output --no-color 
