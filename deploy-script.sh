# BE CAREFUL UPDATING THIS FILE ON THE VM AND THEN RUNNING IT
# CHANGES WILL BE OVERWRITTEN BY THE GIT COPY
RED='\033[0;31m'
YELLOW_BOLD='\033[1;33m'
NC='\033[0m'     # No Colour
echo "${YELLOW_BOLD}deploy-script.sh --> fetching from git${NC}"
git fetch --all
git reset --hard origin/master
echo "${YELLOW_BOLD}deploy-script.sh --> update npm installs${NC}"
cd /home/ivyterrace/trailscape
npm install
cd /home/ivyterrace/trailscape/nodejs
npm install
echo "${YELLOW_BOLD}deploy-script.sh --> copy environment files${NC}"
# environment files are within git archive for this project so following line not needed
# cp -r /home/ivyterrace/iot/env/environments /home/ivyterrace/iot/src
cp /home/ivyterrace/iot/env/.env /home/ivyterrace/iot/nodejs
echo "${YELLOW_BOLD}deploy-script.sh --> build angular${NC}"
cd /home/ivyterrace/iot
# when deployed to subfolder and subfolder is used in the URI, --base-href option is required
ng build --prod --base-href /iot/
cd /home/ivyterrace/iot
echo "${YELLOW_BOLD}deploy-script.sh --> complete${NC}"
