sudo cp -a . ../santab/
sudo rm -rf .git &&
git init &&
git remote add origin https://github.com/benedictgeek/secret-santa.git &&
git fetch && git reset --hard origin/master && git branch --set-upstream-to=origin/master master &&
#heroku git:remote -a clubly2020-api &&
sudo cp -a ../santab/. . &&
sudo rm -rf ../santab

