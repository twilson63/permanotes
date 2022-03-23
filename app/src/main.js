import './tailwind.css'
import App from './App.svelte'
import { arweave } from './services/arweave.js'

const app = new App({
  target: document.getElementById('app')
})

export default app

arweave.network.getInfo().then(console.log)