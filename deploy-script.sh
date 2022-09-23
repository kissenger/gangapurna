git fetch --all
git reset --hard origin/master
ng build --prod --base-href /iot/
sudo /etc/init.d/nginx reload
cp env/.env nodejs
cd nodejs
forever start server.js
