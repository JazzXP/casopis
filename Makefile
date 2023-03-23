VER := $(shell date +%s)

build:
	docker build -t ghcr.io/jazzxp/casopis:latest -t ghcr.io/jazzxp/casopis:$(VER) .
push:
	docker push --all-tags ghcr.io/jazzxp/casopis

.PHONY: build release
