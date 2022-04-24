//import { SmartWeaveWebFactory } from 'redstone-smartweave'
const { SmartWeaveWebFactory } = rsdk
const CONTRACT_SRC = 'ctyBbjOOd1sfJOiDvoNV-wT-8sAYYJ6pLe9bme35BAA'

export function init(arweave) {
  const smartweave = SmartWeaveWebFactory.memCachedBased(arweave)
    .useRedStoneGateway()
    .build()

  function create() {
    return smartweave.createContract.deployFromSourceTx({
      initState: JSON.stringify({ likes: [] }),
      srcTxId: CONTRACT_SRC
    }, true)
  }

  function like(contract, address) {
    return smartweave.contract(contract)
      .connect('use_wallet')
      .writeInteraction({
        function: 'like',
        address
      })
  }

  function unlike(contract, address) {
    return smartweave.contract(contract)
      .connect('use_wallet')
      .writeInteraction({
        function: 'unlike',
        address
      })
  }

  function likes(contract) {
    return smartweave.contract(contract)
      .connect('use_wallet')
      .viewState({
        function: 'likes'
      }).then(res => res.result.likes)
  }

  return {
    create,
    like,
    unlike,
    likes
  }
}