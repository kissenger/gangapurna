echo "deploy-script.sh --> fetching from git"
git fetch --all
git reset --hard origin/master
echo "deploy-script.sh --> update npm installs"
cd /home/ivyterrace/trailscape
npm install
cd /home/ivyterrace/trailscape/nodejs
npm install
echo "deploy-script.sh --> copy environment files"
cp -r /home/ivyterrace/iot/env/environments /home/ivyterrace/iot/src
cp /home/ivyterrace/iot/env/.env /home/ivyterrace/iot/nodejs
echo "deploy-script.sh --> build angular"
cd /home/ivyterrace/iot
ng build --prod --base-href /iot/
cd /home/ivyterrace/iot
echo "deploy-script.sh --> complete"
echo "==========================================="
