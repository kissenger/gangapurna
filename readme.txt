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

# if there are new dependenc ies to install dont forget to:
npm install
npm list grep {{package name}}

# if front end was changed then need to rebuild
ng build --prod

# setup environments and start servers
sudo /etc/init.d/nginx reload
cp env/.env nodejs
cd nodejs
forever start server.js

****OR***
forever list
forever stop {{pid}}
scripts/deploy.sshcd


Nginx setup
-----------
vi /etc/nginx/sites-enabled/default
