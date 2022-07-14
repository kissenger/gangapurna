git fetch --all
git reset --hard origin/master
ng build --prod
cp env/.env nodejs
cd nodejs
forever start server.js
