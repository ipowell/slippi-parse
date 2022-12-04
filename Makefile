include .env

# the usual command to rerun everything
run: gen-js run-js

# compile typescript into js
gen-js:
	npx tsc

# run the generated js
run-js:
	node out/script.js

# set these values in your .env
play:
	${DOLPHIN} -e ${MELEE} -i output/allPeachCombos.json

# depends on https://github.com/kevinsung/slp-to-video being
# installed at the same level as this repo
slp-to-video:
	node ../slp-to-video/slp_to_video.js output/peachCombos.json \
	--ssbm-iso-path=${MELEE} \
	--dolphin-path=${PLAYBACK} \
	--bitrate-kbps=30000