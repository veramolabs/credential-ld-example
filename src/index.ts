import { createDID, createLDCredential, verifyLDCredential } from './credential-flow'
import { setupAgent } from './setup';

(async () => {
  const agent = setupAgent();
  const issuer = await createDID(agent)
  console.log(`issuer created`, issuer.did)
  const credential = await createLDCredential(issuer, agent)
  console.log(`Credential issued`)
  console.dir(credential)
  const verified = await verifyLDCredential(credential, agent)
  console.log(`Credential verified=${verified}`)
})();