import { CredentialPayload, IDIDManager, IIdentifier, TAgent, VerifiableCredential } from "@veramo/core"
import { ICredentialIssuer } from "@veramo/credential-w3c"
import { MY_CUSTOM_CONTEXT_URI } from "./setup"

/**
 * Create a managed DID using the `defaultProvider` configured in ./setup.ts (did:key)
 * @param agent
 */
export async function createDID(agent: TAgent<IDIDManager>): Promise<IIdentifier> {
  const identifier = await agent.didManagerCreate()
  return identifier
}

export async function createEthrDID(agent: TAgent<IDIDManager>): Promise<IIdentifier> {
  const identifier = await agent.didManagerCreate({provider:"did:ethr:rinkeby"})
  return identifier
}

/**
 * Issue a JSON-LD Verifiable Credential using the DID managed by the agent
 *
 * The agent was initialized with a `CredentialIssuer` and `CredentialIssuerLD` plugins (See ./setup.ts) which provide
 * the `createVerifiableCredential` functionality. They internally rely on the `DIDResolver`, `KeyManager`, and
 * `DIDManager` plugins that are used to map the issuer of the `CredentialPayload` to a `VerificationMethod` in the
 * issuer `DID Document` and to a signing key managed by the agent.
 *
 * @param issuer
 * @param agent
 */
export async function createLDCredential(issuer: IIdentifier, agent: TAgent<ICredentialIssuer>): Promise<VerifiableCredential> {
  const credential: CredentialPayload = {
    '@context': [MY_CUSTOM_CONTEXT_URI],
    issuer: issuer.did,
    credentialSubject: {
      "nothing": "else matters" // the `nothing` property is defined in the custom context (See ./setup.ts)
    }
  }
  const verifiableCredential = await agent.createVerifiableCredential({
    credential,
    proofFormat: 'lds' // use LD Signatures as proof
  })
  return verifiableCredential
}
export async function createLDCredentialWithEthrIssuer(issuer: IIdentifier, agent: TAgent<ICredentialIssuer>): Promise<VerifiableCredential> {
  const credential: CredentialPayload = {
    '@context': [MY_CUSTOM_CONTEXT_URI],
    issuer: issuer.did,
    credentialSubject: {
      "nothing": "else matters" // the `nothing` property is defined in the custom context (See ./setup.ts)
    }
  }
  const verifiableCredential = await agent.createVerifiableCredential({
    credential,
    proofFormat: 'lds' // use LD Signatures as proof
  })
  return verifiableCredential
}
/**
 * Verify a credential using the agent.
 *
 * The agent was initialized with the `CredentialIssuer` and `CredentialIssuerLD` plugins (See ./setup.ts) which
 * perform the actual verification. These plugins use the `DIDResolver` plugin to automatically resolve the `DID
 * Document` of the credential issuer during verification to obtain the verification method data specified by the
 * `proof` property of the credential.
 *
 * Note: For the credential issued with a did:ethr, the easiest method is to add  VeramoEcdsaSecp256k1RecoverySignature2020 in your agent setup. Else you won't be able to actually verify the credential.
 * @param credential
 * @param agent
 */
export async function verifyLDCredential(credential: VerifiableCredential, agent: TAgent<ICredentialIssuer>): Promise<boolean> {
  const verified = await agent.verifyCredential({ credential })
  return verified
}