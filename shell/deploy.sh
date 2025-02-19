# #Pushing main
# echo "Moving to builded-version branch"
#  git checkout builded-version
#  git pull
#  git merge main

echo "Building Apps"
 npm i
 npm run build
 if [[ $OSTYPE == 'darwin'* ]]; then
  alias sed=gsed
 fi
 sed -i"" "3i\var dotEnv = require('dotenv');" build/constants/config.js
 sed -i""  "4i\dotEnv.config();" build/constants/config.js

#getting version
# PACKAGE_VERSION=$(cat package.json \
#   | grep version \
#   | head -1 \
#   | awk -F: '{ print $2 }' \
#   | sed 's/[",]//g')

# echo "pushing changes"
#  git add .
#  git commit -m "builded -v$PACKAGE_VERSION"
#  git push
