to run node server:

setup -
$ sudo npm install forever -g

run -
$ cd nodejs
$ forever start server.js


Deployment
----------
forever list
forever stop {{pid}}
git fetch --all
git reset --hard origin/master
cp env/.env nodejs
cd nodejs
forever start server.js

