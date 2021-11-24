import { createAgent, CredentialPayload, IDIDManager, IKeyManager, IResolver } from '@veramo/core'
import { ContextDoc, CredentialIssuerLD, LdDefaultContexts, VeramoEd25519Signature2018 } from '@veramo/credential-ld'
import { CredentialIssuer, ICredentialIssuer } from '@veramo/credential-w3c'
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager'
import { getDidKeyResolver, KeyDIDProvider } from '@veramo/did-provider-key'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { KeyManager, MemoryKeyStore, MemoryPrivateKeyStore } from '@veramo/key-manager'
import { KeyManagementSystem } from '@veramo/kms-local'
import { Resolver } from 'did-resolver'

const customContext: Record<string, ContextDoc> = {
  "https://example.com/custom/context": {
    "@context": {
      "nothing": "https://example.com/custom/context",
    }
  }
}

const agent = createAgent<IResolver & IKeyManager & IDIDManager & ICredentialIssuer>({
  plugins: [
    new KeyManager({
      store: new MemoryKeyStore(),
      kms: {
        local: new KeyManagementSystem(new MemoryPrivateKeyStore())
      }
    }),
    new DIDManager({
      providers: {
        'did:key': new KeyDIDProvider({ defaultKms: 'local' })
      },
      store: new MemoryDIDStore(),
      defaultProvider: 'did:key'
    }),
    new DIDResolverPlugin({
      resolver: new Resolver({ ...getDidKeyResolver() })
    }),
    new CredentialIssuer(),
    new CredentialIssuerLD({
      contextMaps: [LdDefaultContexts, customContext],
      suites: [
        new VeramoEd25519Signature2018()
      ]
    })
  ],
});

(async () => {
  const identifier = await agent.didManagerCreate()
  const credential: CredentialPayload = {
    '@context': ['https://example.com/custom/context'],
    issuer: identifier.did,
    credentialSubject: {
      "nothing": "else matters"
    }
  }
  const verifiableCredential = await agent.createVerifiableCredential({
    credential,
    proofFormat: 'lds'
  })

  console.dir(verifiableCredential)

  const verified = await agent.verifyCredential({
    credential: verifiableCredential
  })

  console.dir(`Credential verification result: ${verified}`)
})();