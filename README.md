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

## What's going on

Out of the box, Veramo works
with [JWT credentials and presentations](https://www.w3.org/TR/vc-data-model/#json-web-token), but when you use
the `CredentialIssuerLD` plugin from `@veramo/credential-ld` your agent gains the ability to work
with [JSON-LD credentials and presentations](https://www.w3.org/TR/vc-data-model/#json-ld).

In this sample project, the agent creates a `did:key` identifier (which automatically creates the corresponding signing
key), and then uses that as the issuer of a credential which it later verifies.

Creating a credential as JSON-LD should be as simple as calling `agent.createVerifiableCredential()` and
using `proofFormat: 'lds'` in the options.

```typescript
const verifiableCredential = await agent.createVerifiableCredential({
  credential: {
    '@context': [/*add your custom context URIs here*/],
    issuer: issuer.did,
    credentialSubject: {
      // ...
    }
  },
  proofFormat: 'lds' // this triggers the use of LD Signatures as proof
})
```

There are, however, extra things to consider when working with JSON-LD.

JSON-LD requires all the contexts to make sense, so you will have to make sure that all the properties you use in the
credential payload are defined in one of the entries you add to `@context`. The properties defined by
the [VC data model](https://www.w3.org/TR/vc-data-model) are automatically covered.

The context URIs you add to your `credential[@context]` array have to be resolvable by the `CredentialIssuerLD` plugin.
This can be done by adding extra mappings `URI => context definition` to the `contextMaps` constructor param for the
plugin.

Keep in mind that the same mappings need to be available to the verifier when credentials are verified, otherwise the LD
signature will not match. Typically, this is done by having issuers and verifiers agree in advance, but this is out of
scope here.

In this example, the same agent acts as both issuer and verifier, so the mappings are identical.

## Contributing

Go to [veramo on github](https://github.com/uport-project/veramo). Contributions are welcome ;)

Join [our discord](https://discord.gg/DsTRjqb42V) for discussions.
