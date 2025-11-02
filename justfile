# https://github.com/casey/just
# https://just.systems/

dev:
    bun run dev

build:
    bun run build

start: build
    bun start

lint:
    bun run lint
    bun run tsc

lintfix:
    bun run lint:fix

format: lintfix

install:
    bun install

outdated:
    bun outdated

codegen:
    curl -s http://localhost:4173
    echo "You MIGHT need to run: bunx playwright install"
    bun run playwright:codegen

test:
    bun run test

upgrade:
    bun update --interactive && bunx biome migrate --write
