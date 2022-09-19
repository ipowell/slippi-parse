run: gen-js run-js

gen-js:
	tsc script.ts

run-js:
	node script.js