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
	${DOLPHIN} -e ${MELEE} -i output/techs.json