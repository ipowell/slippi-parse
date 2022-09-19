# the usual command to rerun everything
run: gen-js run-js

# compile typescript into js
gen-js:
	tsc script.ts --outDir generated

# run the generated js
run-js:
	node generated/script.js