#!/bin/sh

echo "***** Install npm dependencies *****";
npm i
echo "***** Installed npm dependencies *****";


echo "***** Start app  *****";
if [ "$DEV_MOD" = "YES" ] ; then
  echo "***** In dev mod  *****";
  adonis serve --dev
else
  npm run start
fi
