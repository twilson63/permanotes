import Arweave from 'arweave'
import { ArweaveWebWallet } from "arweave-wallet-connector";
import crocks from 'crocks'

const { Async } = crocks;

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
  // Async.of(
  //   new ArweaveWebWallet({
  //     name: 'permanotes',
  //     logo: 'https://via.placeholder.com/200'
  //   })
  // )
  //   .map(wallet => {
  //     wallet.setUrl('https://arweave.app')
  //     return wallet
  //   })
  //   .chain(wallet => Async.fromPromise(wallet.connect)())
  //   .toPromise()

