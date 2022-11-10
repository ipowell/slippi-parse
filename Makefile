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

args:
	${DOLPHIN} -i output/all_rests.json -o output/000-unmerged.json \
	--output-directory=output -b -e ${MELEE} -b --cout

slp-to-video:
	node ../slp-to-video/slp_to_video.js pass_into_rest.json \
	--ssbm-iso-path=${MELEE}