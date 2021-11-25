import { createAgent, IDIDManager, IKeyManager, IResolver, TAgent } from '@veramo/core'
import { ContextDoc, CredentialIssuerLD, LdDefaultContexts, VeramoEd25519Signature2018 } from '@veramo/credential-ld'
import { CredentialIssuer, ICredentialIssuer } from '@veramo/credential-w3c'
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager'
import { getDidKeyResolver, KeyDIDProvider } from '@veramo/did-provider-key'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { KeyManager, MemoryKeyStore, MemoryPrivateKeyStore } from '@veramo/key-manager'
import { KeyManagementSystem } from '@veramo/kms-local'
import { Resolver } from 'did-resolver'

export const MY_CUSTOM_CONTEXT_URI = "https://example.com/custom/context"

const extraContexts: Record<string, ContextDoc> = {}
extraContexts[MY_CUSTOM_CONTEXT_URI] = {
  "@context": {
    "nothing": "https://example.com/custom/context",
  }
}

export function setupAgent(): TAgent<ICredentialIssuer & IDIDManager> {
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
        contextMaps: [LdDefaultContexts, extraContexts],
        suites: [
          new VeramoEd25519Signature2018()
        ]
      })
    ],
  });
  return agent
}
