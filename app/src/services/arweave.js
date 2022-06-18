import Arweave from 'arweave'
import Account from 'arweave-account'
import Topics from 'arweave-topics'

import path from 'ramda/src/path'
import pluck from 'ramda/src/pluck'
import map from 'ramda/src/map'
import mergeAll from 'ramda/src/mergeAll'

import { ArweaveWebWallet } from "arweave-wallet-connector";
import { readContract, selectWeightedPstHolder } from 'smartweave'

// PST for permanotes
const PERMANOTE_PST = 'cwElAMnBqu2fp-TUsV9lBIZJi-DRZ5tQJgJqxhFjqNY'
const CONTRACT_SRC = '0hTokSQ7m3DQujuVisZ-RzcU6hOY3-Uz2ZIh4Aa0nKY'
const FEE = '.004'
const arweaveAccount = new Account()

export const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

export const topics = Topics(arweave)

let wallet = null

export const connectApp = () => {
  wallet = new ArweaveWebWallet({
    name: 'permanotes',
    logo: `${window.location.origin}/permanote.png`
  })

  wallet.setUrl('https://arweave.app')
  return wallet.connect()
}

export const account = async (address) => await arweaveAccount.get(address)

export const handle = async (handle) => {
  console.log(handle)
  return await arweaveAccount.search(handle)
}

export const load = async (id) => {
  // need to get headers
  const headers = await arweave.api.post('graphql', {
    query: `
query {
  transaction(id: "${id}") {
    id
    tags {
      name
      value
    }
  }
}
  `}).then(({ data }) => mergeAll(map(t => ({ [t.name]: t.value }), data.data.transaction.tags)))

  // if protocol v0.2 then get text/markdown and decrypt if necessary

  if (headers.Protocol === 'PermaNotes-v0.2') {
    //res.data.content = decryptString
    return {
      title: headers['Note-Title'],
      description: headers['Note-Description'],
      public: Boolean(headers['Note-Public']),
      likes: [],
      owner: '',
      content: 'This Version of permanotes is not supported'
    }
  }
  // if protocol v0.1 then get app/json and decrypt if necessary

  if (['PermaNotes-v0.1', 'PermaNotes-v0.3'].includes(headers.Protocol)) {
    return arweave.api.get(id, { mode: 'no-cors' })
      .then(async res => {
        if (!res.data.public) {
          if (wallet) {
            const encryptedData = Object.values(res.data.content)
            const symmetricKeyBytes = new Uint8Array(encryptedData.slice(0, 512))
            const contentBytes = new Uint8Array(encryptedData.slice(512))
            const symmetricKey = await decryptRSA(symmetricKeyBytes)
            const decryptString = arweave.utils.bufferToString(
              await arweave.crypto.decrypt(contentBytes, symmetricKey)
            )
            res.data.content = decryptString
          } else {
            // @ts-ignore
            // eslint-disable-next-line no-undef
            res.data.content = await arweaveWallet.decrypt(
              new Uint8Array(Object.values(res.data.content)),
              {
                algorithm: "RSA-OAEP",
                hash: "SHA-256",
              }
            )
          }
        }
        return res.data
      })
  }

}

export const postWebpage = async (data) => {
  let result
  const tx = await arweave.createTransaction({ data })
  tx.addTag('content-type', 'text/html')
  try {
    // try bundlr first
    result = await arweaveWallet.dispatch(tx)

    return result
  } catch (e) {
    // then arweave
    await arweave.transactions.sign(tx)
    await arweave.transactions.post(tx)
  }

  return result
}

export const postTx = async (note) => {

  // encrypt content if private
  if (!note.public) {
    if (wallet) {
      const contentEncoder = new TextEncoder()
      const contentBuffer = contentEncoder.encode(note.content)
      const keyBuffer = generateRandomBytes()
      const encryptedContent = await arweave.crypto.encrypt(contentBuffer, keyBuffer)
      const publicKey = await wallet.getPublicKey()
      const jwk = await buildPublicKey(publicKey)
      const encryptedKey = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, jwk, keyBuffer)
      note.content = arweave.utils.concatBuffers([encryptedKey, encryptedContent])
    } else {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      note.content = await arweaveWallet.encrypt(note.content, {
        algorithm: 'RSA-OAEP',
        hash: 'SHA-256'
      })
    }

  }

  // get target wallet
  // const contractState = await readContract(arweave, PERMANOTE_PST)
  // const holder = selectWeightedPstHolder(contractState.balances)

  const tx = await arweave.createTransaction({
    data: JSON.stringify(note),
    // Free to create notes
    // target: holder,
    // quantity: arweave.ar.arToWinston(FEE)
  })

  tx.addTag('Content-Type', 'application/json')
  tx.addTag('App-Name', 'PermaNotes')
  tx.addTag('Protocol', note.protocol)
  tx.addTag('Note-Title', note.title)
  tx.addTag('Description', note.description)
  tx.addTag('Note-Topic', note.topic)
  tx.addTag('Note-Rev', note.rev)
  tx.addTag('Note-Public', note.public ? "true" : "false")
  tx.addTag('Timestamp', new Date().toISOString())

  let result = tx

  try {
    // try bundlr first
    result = await arweaveWallet.dispatch(tx)

    return result
  } catch (e) {
    // then arweave
    await arweave.transactions.sign(tx)
    await arweave.transactions.post(tx)
  }

  return result

}

export const payment = async () => {
  const contractState = await readContract(arweave, CONTRACT_ID)
  const holder = selectWeightedPstHolder(contractState.balances)
  const fee = await arweave.createTransaction({
    target: holder,
    quantity: arweave.ar.arToWinston('.001')
  })
  await arweave.transactions.sign(fee)
  return await arweave.transactions.post(fee)
}

export const myNotes = async () => {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const owner = await arweaveWallet.getActiveAddress()
  const result = await arweave.api.post('graphql', {
    query: `
query {
  transactions(owners: ["${owner}"], tags: { name: "Protocol", values: ["PermaNotes-v0.1"]}) {
    edges {
      node {
        id
        owner {
          address
        }
        tags {
          name
          value
        }
      }
    }
  }
}
    `
  })
  return pluck('node', path(['data', 'data', 'transactions', 'edges'], result))
}

export const gql = (query) => arweave.api.post('graphql', { query })

export const waitfor = async (txId) => {
  let count = 0;
  let foundPost = null;

  while (!foundPost) {
    count += 1;
    console.log(`attempt ${count}`);
    await delay(2000 * count);
    const result = await arweave.api.post('graphql', {
      query: `
query {
  transaction(id: "${txId}") {
    id
  }
}
    `});

    if (result?.data?.data?.transaction) {
      foundPost = result.data.data.transaction.id === txId;
    }

    if (count > 1) {
      break; // could not find post
    }
  }
  return { id: txId, foundPost }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function decryptRSA(data) {
  if (wallet != null) {
    console.log(wallet)
    // arweave.app Case
    // =========================================================================
    return await wallet.decrypt(data, { name: 'RSA-OAEP' });
  } else {
    // ArConnect Case
    // =========================================================================
    throw `Cannot perform RSA decryption with ArConnect`;
  }
}

function generateRandomBytes() {
  const array = new Uint8Array(256)
  return crypto.getRandomValues(array)
}

export async function buildPublicKey(pk) {
  console.log(pk)
  const keyData = {
    kty: 'RSA',
    e: 'AQAB',
    n: pk,
    alg: 'RSA-OAEP-256',
    ext: true,
  };

  const algo = {
    name: 'RSA-OAEP',
    hash: {
      name: 'SHA-256',
    },
  };

  return crypto.subtle.importKey('jwk', keyData, algo, false, ['encrypt']);
}
