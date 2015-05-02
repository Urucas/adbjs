
BABEL = ./node_modules/.bin/babel

all: node

node: lib
	@mkdir -p ./bin
	$(BABEL) "lib/adb.js" > "bin/adbjs"

clean:
	@rm -rf ./node/
