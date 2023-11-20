#!/bin/bash
cd "$(dirname "$0")"

mkdir dist
rm -rf dist/*

# build
(cd backend && npm i && npm run build) || exit 1
(cd frontend && npm i && npm run build-only) || exit 1

# copy backend
cp -r backend/dist/* dist
cp -r backend/node_modules dist
cp backend/config.json dist

# copy front end
mkdir dist/_client
cp -r frontend/dist/* dist/_client

# create start script
echo '#!/bin/bash' > dist/start.sh
echo 'cd "$(dirname "$0")"' >> dist/start.sh
echo 'node main.js' >> dist/start.sh
chmod +x dist/start.sh
