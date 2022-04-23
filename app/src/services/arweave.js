import Arweave from 'arweave'
import Account from 'arweave-account'
import { path, pluck } from 'ramda'

import { ArweaveWebWallet } from "arweave-wallet-connector";
import { readContract, selectWeightedPstHolder } from 'smartweave'

const CONTRACT_ID = 'cwElAMnBqu2fp-TUsV9lBIZJi-DRZ5tQJgJqxhFjqNY'

const arweaveAccount = new Account()

export const arweave = new Arweave.init({
  host: import.meta.env.VITE_ARWEAVE || 'arweave.net',
  port: '443',
  protocol: 'https'
})

export const connectApp = () => {
  const wallet = new ArweaveWebWallet({
    name: 'permanotes',
    logo: 'https://via.placeholder.com/200'
  })
  wallet.setUrl('https://arweave.app')
  return wallet.connect()
}

export const account = (address) => arweaveAccount.get(address)

export const readNote = async (txId) => {
  const data = await arweave.getData(txId)
  console.log(data)
}

export const postTx = async (note) => {
  if (!note.public) {
    const enc = await arweaveWallet.encrypt(note.content, {
      algorithm: 'RSA-OAEP',
      hash: 'SHA-256'
    })
    console.log('enc', enc)
    note.content = enc
  }

  const tx = await arweave.createTransaction({
    data: JSON.stringify(note)
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