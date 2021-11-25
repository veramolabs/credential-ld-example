# Veramo credential-LD sample

Sample code for issuing and verifying a JSON-LD credential with Veramo. See [veramo.io](https://veramo.io) for an
introduction to Veramo.

## Usage

```bash
# install dependencies
yarn install

# run src/index.ts
yarn start

# or run the tests 
yarn test
```

[src/setup.ts](./src/setup.ts) shows how to create a minimalistic agent that can manage `did:key` identifiers in memory
and use them to issue credentials.

[src/credential-flow.ts](./src/credential-flow.ts) shows how to use that agent to create a DID and issue and verify a
credential.

## Updating

You can run `yarn update:veramo` to bump the veramo packages to the latest development version.

## Contributing

Go to [veramo on github](https://github.com/uport-project/veramo). Contributions are welcome ;)

Join [our discord](https://discord.gg/DsTRjqb42V) for discussions.
