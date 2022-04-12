import Arweave from 'arweave'
import deepHash from 'arweave/node/lib/deepHash.js'
import Account from 'arweave-account'

import ArweaveBundles from 'arweave-bundles'
import { ArweaveWebWallet } from "arweave-wallet-connector";

const arweaveAccount = new Account()

export const arweave = new Arweave.init({
  host: import.meta.env.VITE_ARWEAVE || 'arweave.net',
  port: '443',
  protocol: 'https'
})

const arBundles = ArweaveBundles({
  utils: Arweave.utils,
  crypto: Arweave.crypto,
  deepHash
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

export const postTx = async (note) => {
  const enc = await arweave.crypto.encrypt(arweave.utils.stringToBuffer(note.content), note.owner)
  note.content = enc.toString()
  console.log('note', note)

  const tx = await arweave.createTransaction({
    data: JSON.stringify(note)
  })
  //const tx = await arBundles.createData({ data: JSON.stringify(note) })


  tx.addTag('Content-Type', 'application/json')
  tx.addTag('App-Name', 'PermaNotes')
  tx.addTag('Protocol', note.protocol)
  tx.addTag('Note-Title', note.title)
  tx.addTag('Note-Topic', note.topic)
  tx.addTag('Note-Rev', note.rev)

  //note.tags.map((tag, i) => tx.addTag(`Tag${i}`, tag))

  await arweave.transactions.sign(tx)
  await arweave.transactions.post(tx)
  return tx.id
  // const d = await arBundles.sign(tx)
  // const bundle = await arBundles.bundleData([d])
  // const bundleTx = await arweave.createTransaction({ data: bundle })
  // bundleTx.addTag('Bundle-Format', 'json')
  // bundleTx.addTag('Bundle-Version', '1.0.0')
  // bundleTx.addTag('Content-Type', 'application/json')
  // await arweave.transactions.sign(bundleTx)
  // return await arweave.transactions.post(bundleTx)


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
    foundPost = result.data.data.transaction.id === txId;
    if (count > 10) {
      break; // could not find post
    }
  }
  return foundPost
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}