const url = 'https://arweave.net'

export const arweave = {
  network: {
    getInfo() {
      return fetch(`${url}/info`).then(res => res.json())
    },
    getPeers() {
      return fetch(`${url}/peers`).then(res => res.json())
    }
  }
}