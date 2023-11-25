#!/bin/bash
cd "$(dirname "$0")"

mkdir dist
mkdir dist/cache

# clean
(cd dist && (ls | grep -v "cache" | grep -v "config.json" | xargs rm -r))
(cd dist/cache && (ls | grep -v ".json" | xargs rm -r))

# build
(cd backend && npm i && npm run build) || exit 1
(cd frontend && npm i && npm run build) || exit 1

# copy backend
cp -r backend/dist/* dist
cp -r backend/node_modules dist
cp -n backend/config.json dist

# copy front end
mkdir dist/_client
cp -r frontend/dist/* dist/_client

# create start script
echo '#!/bin/bash' > dist/start.sh
echo 'cd "$(dirname "$0")"' >> dist/start.sh
echo 'node main.js' >> dist/start.sh
chmod +x dist/start.sh
