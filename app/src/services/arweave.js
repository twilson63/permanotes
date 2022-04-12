import Arweave from 'arweave'
import deepHash from 'arweave/node/lib/deepHash.js'
import Account from 'arweave-account'

import ArweaveBundles from 'arweave-bundles'
import { ArweaveWebWallet } from "arweave-wallet-connector";

const arweaveAccount = new Account()

export const arweave = new Arweave.init({
  host: 'arweave.net',
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

  // const tx = await arweave.createTransaction({
  //   data: JSON.stringify(note)
  // })
  const tx = await arBundles.createData({ data: JSON.stringify(note) })


  tx.addTag('Content-Type', 'application/json')
  tx.addTag('App-Name', 'PermaNotes')
  tx.addTag('Protocol', note.protocol)
  tx.addTag('Note-Title', note.title)
  tx.addTag('Note-Topic', note.topic)
  tx.addTag('Note-Rev', note.rev)

  //note.tags.map((tag, i) => tx.addTag(`Tag${i}`, tag))

  //await arweave.transactions.sign(tx)
  const d = await arBundles.sign(tx)
  const bundle = await arBundles.bundleData([d])
  const bundleTx = await arweave.createTransaction({ data: bundle })
  bundleTx.addTag('Bundle-Format', 'json')
  bundleTx.addTag('Bundle-Version', '1.0.0')
  bundleTx.addTag('Content-Type', 'application/json')
  await arweave.transactions.sign(bundleTx)
  return await arweave.transactions.post(bundleTx)


}