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

