version:
	echo '14.18.2'
install:
	yarn install
run:
	NODE_ENV=develop npm run start:dev
build:
	npm run build
clean:
	rm -rdf dist
	rm -rdf node_modules
add-migration:
	typeorm migration:create -n ${NAME}