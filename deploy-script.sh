# not convinced that running as script works, because need to wait for ngbuild to finish
git fetch --all
git reset --hard origin/master
ng build --prod --base-href /iot/
#not needed unless conf file is changed?
sudo /etc/init.d/nginx reload
cp env/.env nodejs
cd nodejs
forever start server.js
