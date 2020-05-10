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

lint:
	npx eslint .

hl:
	heroku logs -a task-manager-tm -t --force-colors

am:
	git add .
	git commit --amend
	git push -f origin feature/step_1_fastify
	