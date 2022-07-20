import { createAgent, IDIDManager, IKeyManager, IResolver, TAgent } from '@veramo/core'
import { ContextDoc, CredentialIssuerLD, LdDefaultContexts, VeramoEd25519Signature2018,VeramoEcdsaSecp256k1RecoverySignature2020 } from '@veramo/credential-ld'
import { CredentialIssuer, ICredentialIssuer } from '@veramo/credential-w3c'
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager'
import { getDidKeyResolver, KeyDIDProvider } from '@veramo/did-provider-key'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { KeyManager, MemoryKeyStore, MemoryPrivateKeyStore } from '@veramo/key-manager'
import { KeyManagementSystem } from '@veramo/kms-local'
import { Resolver } from 'did-resolver'
import { EthrDIDProvider } from '@veramo/did-provider-ethr'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'

export const MY_CUSTOM_CONTEXT_URI = "https://example.com/custom/context"

const extraContexts: Record<string, ContextDoc> = {}
extraContexts[MY_CUSTOM_CONTEXT_URI] = {
  "@context": {
    "nothing": "https://example.com/custom/context",
  }
}
const INFURA_PROJECT_ID = "7162f765a166498a8956d9183c4837b3"

export function setupAgent() {
  const agent = createAgent<IResolver & IKeyManager & IDIDManager & ICredentialIssuer>({
    plugins: [
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          local: new KeyManagementSystem(new MemoryPrivateKeyStore()) // for this sample, keys are stored in memory
        }
      }),
      new DIDManager({
        providers: {
          'did:key': new KeyDIDProvider({ defaultKms: 'local' }),
          'did:ethr:goerli': new EthrDIDProvider({
            defaultKms: 'local',
            network: 'goerli',
            rpcUrl: 'https://goerli.infura.io/v3/' + INFURA_PROJECT_ID,
            gas: 100000,
            ttl: 60 * 60 * 24 * 30 * 12 + 1,
          }),
        },
        store: new MemoryDIDStore(),
        defaultProvider: 'did:key'
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }), ...getDidKeyResolver() })
      }),
      new CredentialIssuer(),
      new CredentialIssuerLD({
        contextMaps: [LdDefaultContexts, extraContexts],
        suites: [
          new VeramoEd25519Signature2018(),
          new VeramoEcdsaSecp256k1RecoverySignature2020() //needed for did:ethr
        ]
      })
    ],
  });
  return agent
}
