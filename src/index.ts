import { createDID, createEthrDID, createLDCredential, createLDCredentialWithEthrIssuer, verifyLDCredential } from './credential-flow'
import { setupAgent } from './setup';

(async () => {
  const agent = setupAgent();
  const issuer = await createDID(agent)
  console.log(`issuer created`, issuer.did)
  const ethrIssuer = await createEthrDID(agent)
  console.log(`ethr issuer created`, ethrIssuer.did)

  const credential = await createLDCredential(issuer, agent)
  console.log(`Credential issued`)
  console.dir(credential)
  const credentialEthr = await createLDCredentialWithEthrIssuer(ethrIssuer,agent)
  console.log(`Credential issued`)
  console.dir(credentialEthr)
  const verified = await verifyLDCredential(credential, agent)
  console.log(`Credential verified=${verified}`)
  const verifiedEthrCredential = await verifyLDCredential(credentialEthr, agent)
  console.log(`ETHR Credential verified=${verified}`)

})();