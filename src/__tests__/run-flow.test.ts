import { IDIDManager, IIdentifier, TAgent, VerifiableCredential } from "@veramo/core"
import { ICredentialIssuer } from "@veramo/credential-w3c"
import { createDID, createLDCredential, verifyLDCredential } from "../credential-flow"
import { setupAgent } from "../setup"

describe('credential flow', () => {
    let agent: TAgent<IDIDManager & ICredentialIssuer>, issuer: IIdentifier, credential: VerifiableCredential
    it('can create agent', async () => {
        expect.assertions(2)
        agent = setupAgent()
        expect(agent).toBeDefined()
        expect(agent.didManagerCreate).toBeDefined()
    })

    it('can create issuer', async () => {
        expect.assertions(2)
        issuer = await createDID(agent)
        expect(issuer).toBeDefined()
        expect(issuer.provider).toBe('did:key')
    })

    it('can create LD credential', async () => {
        expect.assertions(3)
        credential = await createLDCredential(issuer, agent)
        expect(credential).toBeDefined()
        expect(credential.proof).toBeDefined()
        expect(credential.proof.type).toBe('Ed25519Signature2018')
    })

    it('can verify credential', async () => {
        expect.assertions(1)
        const verification = await verifyLDCredential(credential, agent)
        expect(verification).toEqual(true)
    })
})