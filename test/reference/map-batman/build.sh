#!/bin/bash

/home/fis/npm/bin/fisp --version --no-color
#use --unique option
/home/fis/npm/bin/fisp release -omupd output --no-color -r transit 
/home/fis/npm/bin/fisp release -omupd output --no-color -r place 
/home/fis/npm/bin/fisp release -omupd output --no-color -r common 
/home/fis/npm/bin/fisp release -omupd output --no-color -r index 
/home/fis/npm/bin/fisp release -omupd output --no-color -r addr 
/home/fis/npm/bin/fisp release -omupd output --no-color -r feedback 
/home/fis/npm/bin/fisp release -omupd output --no-color -r drive 
/home/fis/npm/bin/fisp release -omupd output --no-color -r walk 
/home/fis/npm/bin/fisp release -omupd output --no-color -r third
/home/fis/npm/bin/fisp release -omupd output --no-color -r taxi
/home/fis/npm/bin/fisp release -omupd output --no-color -r user
mkdir ./output/

cp -r ./transit/output/* ./output/
cp -r ./place/output/* ./output/
cp -r ./common/output/* ./output/
cp -r ./index/output/* ./output/
cp -r ./addr/output/* ./output/
cp -r ./feedback/output/* ./output/
cp -r ./drive/output/* ./output/
cp -r ./walk/output/* ./output/
cp -r ./third/output/* ./output/
cp -r ./user/output/* ./output/
cp -r ./taxi/output/* ./output/
