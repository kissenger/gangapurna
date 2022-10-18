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

# if there are new dependencies to install dont forget to:
npm install
npm list grep {{package name}}

# if front end was changed then need to rebuild
ng build --prod --base-href /iot/

# setup environments and start servers
sudo /etc/init.d/nginx reload
cp env/.env nodejs
cd nodejs
forever start server.js

****OR***
forever list
forever stop {{pid}}
sh deploy-script.sh

****OR***
forever restartall

check forever logs:
forever list --> lists logfiles

Nginx setup
-----------
sudo vi /etc/nginx/sites-enabled/default

#view error logs
tail /var/log/nginx/error.log

Node server
-----------
In deployment, run forever server as above.
For debugging its useful to see output messages so run:
cd nodejs
npm run server

To stop can use:
sudo ss -lptn
sudo kill -9 {{pid}}
