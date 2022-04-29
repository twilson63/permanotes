import Arweave from 'arweave'
import Account from 'arweave-account'

import path from 'ramda/src/path'
import pluck from 'ramda/src/pluck'

import { ArweaveWebWallet } from "arweave-wallet-connector";
import { readContract, selectWeightedPstHolder } from 'smartweave'

const CONTRACT_ID = 'cwElAMnBqu2fp-TUsV9lBIZJi-DRZ5tQJgJqxhFjqNY'
const FEE = '.004'
const arweaveAccount = new Account()

export const arweave = new Arweave.init({
  host: import.meta.env.VITE_ARWEAVE || 'arweave.net',
  port: '443',
  protocol: 'https'
})

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

export const load = (id) => arweave.api.get(id)
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

export const postTx = async (note) => {

  // encrypt content if private
  if (!note.public) {
    if (wallet) {
      const contentEncoder = new TextEncoder()
      const contentBuffer = contentEncoder.encode(note.content)
      const keyBuffer = generateRandomBytes(256)
      const encryptedContent = await arweave.crypto.encrypt(contentBuffer, keyBuffer)
      const publicKey = await wallet.getPublicKey()
      const jwk = await buildPublicKey(publicKey)
      const encryptedKey = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, jwk, keyBuffer)
      note.content = arweave.utils.concatBuffers([encryptedKey, encryptedContent])
    } else {
      note.content = await arweaveWallet.encrypt(note.content, {
        algorithm: 'RSA-OAEP',
        hash: 'SHA-256'
      })
    }

  }

  // get target wallet
  const contractState = await readContract(arweave, CONTRACT_ID)
  const holder = selectWeightedPstHolder(contractState.balances)

  const tx = await arweave.createTransaction({
    data: JSON.stringify(note),
    target: holder,
    quantity: arweave.ar.arToWinston(FEE)
  })

  tx.addTag('Content-Type', 'application/json')
  tx.addTag('App-Name', 'PermaNotes')
  tx.addTag('Protocol', note.protocol)
  tx.addTag('Note-Title', note.title)
  tx.addTag('Description', note.description)
  tx.addTag('Note-Topic', note.topic)
  tx.addTag('Note-Rev', note.rev)
  tx.addTag('Timestamp', new Date().toISOString())

  //note.tags.map((tag, i) => tx.addTag(`Tag${i}`, tag))
  //return await arweaveWallet.dispatch(tx)
  await arweave.transactions.sign(tx)
  await arweave.transactions.post(tx)
  return tx
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

    if (count > 10) {
      break; // could not find post
    }
  }
  return foundPost
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
