include .env

# the usual command to rerun everything
run: gen-js run-js

# compile typescript into js
gen-js:
	npx tsc

# run the generated js
run-js:
	node generated/script.js

# set these values in your .env
play:
	${DOLPHIN} -e ${MELEE} -i output/landed_rests.json

# depends on https://github.com/kevinsung/slp-to-video being
# installed at the same level as this repo
slp-to-video:
	node ../slp-to-video/slp_to_video.js pass_into_rest.json \
	--ssbm-iso-path=${MELEE}