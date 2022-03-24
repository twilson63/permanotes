import './tailwind.css'
import App from './App.svelte'
//import { arweave } from './services/arweave.js'
import Arweave from 'arweave'

const arweave = new Arweave.init({
  host: 'arweave.net',
  port: '443',
  protocol: 'https'
})

arweave.network.getInfo().then(console.log)

const app = new App({
  target: document.getElementById('app')
})

export default app

arweave.network.getInfo().then(console.log)