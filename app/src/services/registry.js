import Arweave from 'arweave'

import map from 'ramda/src/map'
import pluck from 'ramda/src/pluck'

const { WarpWebFactory, LoggerFactory } = window.warp

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

LoggerFactory.INST.logLevel("error");
const warp = WarpWebFactory.memCached(arweave)

const REGISTRY = "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U"
const ANT_SOURCE = "JIIB01pRbNK2-UyNxwQK-6eknrjENMTpTvQmB8ZDzQg"


export async function register({ name, owner, transactionId }) {
  const registry = warp.pst(REGISTRY).connect('use_wallet')
  const registryState = hydrate(await registry.currentState())

  if (registryState.records[name]) {
    return { ok: false, message: `This name ${name} is already taken and is not available for purchase` }
  }

  // create ANT contract
  const ant = await warp.createContract.deployFromSourceTx({
    wallet: 'use_wallet',
    initState: JSON.stringify({
      ticker: `ANT-${name.toUpperCase()}`,
      name,
      owner,
      evolve: null,
      records: {
        ["@"]: transactionId
      },
      balances: {
        [owner]: 1
      }
    }),
    srcTxId: ANT_SOURCE
  })


  // buy ArNS
  const res = await registry.writeInteraction({
    function: 'buyRecord',
    name,
    contractTransactionId: ant
  })



  return { ok: true, ant, message: `Successfully registred ${name}.arweave.net` }
}

export async function listANTs(owner) {
  const result = await arweave.api.post('graphql', {
    query: `
query {
  transactions(owners: ["${owner}"], tags: {name: "Contract-Src", values: ["${ANT_SOURCE}"]}) {
    edges {
      node {
        id
      }
    }
  }
}
    `
  })

  const ids = pluck('id', pluck('node', result.data.data.transactions.edges))
  const ants = await Promise.all(
    map(getANT, ids)
  )

  return Promise.resolve(ants)

}

export async function getANT(ANT) {
  const ant = warp.pst(ANT)
  return await ant.currentState()
}

export async function upsertSubDomain(ANT, subDomain, transactionId) {
  const ant = warp.pst(ANT).connect('use_wallet')
  await ant.bundleInteraction({
    function: 'setRecord',
    subDomain,
    transactionId
  })
  return { ok: true }
}

export async function removeSubDomain(ANT, subDomain) {
  const ant = warp.pst(ANT).connect('use_wallet')
  await ant.bundleInteraction({
    function: 'removeRecord',
    subDomain
  })
  return { ok: true }
}

export async function transfer(ANT, target) {
  const ant = warp.pst(ANT).connect('use_wallet')
  await ant.transfer({
    target,
    qty: 1
  })
  return { ok: true }
}

// utility functions
function hydrate(s) {
  return JSON.parse(JSON.stringify(s))
}

