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

heroku-start:
	npm install
	npm run build-configs
	npm run build-server
	npm run start

heroku-start1:
	rm -rf ./dist
	npm run build-configs
	npm run build-server
	npm run start

t:
	npm run test -- --verbose

ts:
	npm run test -- --verbose --silent --noStackTrace --debug false

tc:
	npm test -- --verbose --silent --coverage

lint:
	npx eslint .

hl:
	heroku logs -a task-manager-tm -t --force-colors

am:
	git add .
	git commit --amend
	git push -f origin feature/step_1_fastify
