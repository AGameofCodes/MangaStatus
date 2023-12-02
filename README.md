# MangaStatus [![Build](https://github.com/AGameofCodes/MangaStatus/actions/workflows/node.js.yml/badge.svg)](https://github.com/AGameofCodes/MangaStatus/actions/workflows/node.js.yml)
This is small personal project to get an overview what manga have new chapters available and how many.
This project is hosted on https://mangastatus.agameof.codes/

## Credits
<div>
<img src="https://anilist.co/favicon.ico" alt="AniList logo" height="16" width="16">
<a href="https://anilist.co">AniList</a> (manga images, titles, personal score & progress)
</div>
<div>
<img src="https://mangadex.org/favicon.ico" alt="MangaDex logo" height="16" width="16">
<a href="https://mangadex.org">MangaDex</a> (linking between AniList and MangaUpdates)
</div>
<div>
<img src="https://www.mangaupdates.com/favicon.ico" alt="MangaUpdates logo" height="16" width="16">
<a href="https://www.mangaupdates.com">MangaUpdates</a> (chapter availability)
</div>

## Building
Execute the `build.sh` script. After building the artefacts will be in the `dist` folder.

## Running
After building, configure the `dist/config.json`, then run `dist/start.sh`.

## Development
The project is divided into a frontend and backend. 
Use `npm run dev` for frontend and backend to start them.
The frontend uses vite with hmr enabled in dev mode.
The backend restarts when changes are detected in the typescript files.

