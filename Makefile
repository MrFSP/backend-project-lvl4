setup:
	npm install

prepare:
	touch .env

start:
	heroku local -f Procfile.dev

start-backend:
	npx nodemon --exec npx babel-node server/bin/server.js

start-frontend:
	npx webpack-dev-server

test-coverage:
	npm test -- --runInBand --coverage

lint:
	npx eslint .

hsp:
	npm run-script start

hsl:
	npm run build
	npm run-script start

t:
	npm run test -- --verbose --runInBand

ts:
	npm run test -- --verbose --silent --noStackTrace --debug false

tc:
	npm test -- --runInBand --coverage --verbose --silent --noStackTrace --debug false

hl:
	heroku logs -a task-manager-tm -t --force-colors

am:
	git add .
	git commit --amend
	git push -f origin develop
