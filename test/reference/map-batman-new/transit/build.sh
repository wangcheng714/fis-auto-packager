#!/bin/bash
set -e
#add path
export PATH=/home/fis/npm/bin:$PATH
#use --unique option
fisp release -Domupld output --no-color
set +e

mkdir lighttpd
mkdir lighttpd/htdocs
mkdir lighttpd/htdocs/mobile
mkdir lighttpd/htdocs/mobile/simple
cp -r ./output/static ./lighttpd/htdocs/mobile/simple/

mkdir phpui
mkdir phpui/webapp
mkdir phpui/webapp/smarty
cp -r ./output/plugin ./phpui/webapp/smarty/
cp -r ./output/config ./phpui/webapp/smarty/

mkdir phpui/webapp/views/
cp -r ./output/template ./phpui/webapp/views



rm -r ./output/test
rm -r ./output/server.conf
rm -r ./output/plugin
rm -r ./output/config
rm -r ./output/static
rm -r ./output/server-conf/
rm -r ./output/template/*

mkdir ./output/template/config
cp ./xss.php ./output/template/config

rm -r ./output/xss.php

tar -czvf transit.tar.gz ./phpui ./lighttpd > /dev/null
mv transit.tar.gz ./output
