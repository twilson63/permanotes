const { SmartWeaveWebFactory, LoggerFactory } = rsdk

LoggerFactory.INST.logLevel('fatal');
const CONTRACT_SRC = '-pTzzqJRvzHHcnj5ylgcsdKhtedGb79jhDxTcV6gYiU'

export function init(arweave) {
  const smartweave = SmartWeaveWebFactory.memCachedBased(arweave)
    .useRedStoneGateway({ notCorrupted: true })
    .build()

  function add(contract, txId) {
    return smartweave.contract(contract).bundleInteraction({ function: 'add', tx: txId })
  }

  function remove(contract, txId) {
    return smartweave.contract(contract).bundleInteraction({ function: 'remove', tx: txId })
  }

  function list(contract) {
    return smartweave.contract(contract).readState().then(({ state }) => state.favorites)
  }

  return {
    add,
    remove,
    list
  }
}