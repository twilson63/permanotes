import Arweave from 'arweave'
import Account from 'arweave-account'

import { ArweaveWebWallet } from "arweave-wallet-connector";



const arweaveAccount = new Account()

export const arweave = new Arweave.init({
  host: 'arweave.net',
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

export const postTx = async (note) => {
  // TODO: Encrypt content
  // Note consider to use Async here
  const tx = await arweave.createTransaction({
    data: note
  })
  tx.addTag('Content-Type', 'application/json')
  tx.addTag('Note-Title', note.title)
  tx.addTag('App-Name', 'PermaNotes')
  tx.addTag('Protocol', note.protocol)
  note.tags.map((tag, i) => tx.addTag(`Tag${i}`, tag))

  await arweave.tranactions.sign(tx)
  await arweave.transactions.post(tx)


}