.PHONY: dev
dev:
	cd frontend && npm run dev

.PHONY: node
node:
	npx hardhat node

.PHONY: deploy
deploy:
	npx hardhat ignition deploy ./ignition/modules/DeFi.ts --network localhost

.PHONY: generate
generate:
	cd frontend && npx wagmi generate

.PHONY: test
test:
	npx hardhat test

.PHONY: coverage
coverage:
	npx hardhat coverage
