//import { SmartWeaveWebFactory } from 'redstone-smartweave'
// eslint-disable-next-line no-unused-vars
/* global rsdk */
// @ts-ignore
const { SmartWeaveWebFactory, LoggerFactory } = window.rsdk
const CONTRACT_SRC = 'Hljxh8rYyXCb45BYULHb6KhUDnRkxc4ZUaUDCUkOP_w'

LoggerFactory.INST.logLevel("fatal");

export function init(arweave) {
  const smartweave = SmartWeaveWebFactory.memCachedBased(arweave)
    .useRedStoneGateway({ notCorrupted: true })
    .build()

  function create() {
    return smartweave.createContract.deployFromSourceTx({
      initState: JSON.stringify({ addresses: [] }),
      srcTxId: CONTRACT_SRC
    }, true)
  }

  function like(contract = '', address = '') {
    if (contract === '') {
      throw new Error('contract can not be empty!')
    }
    if (address === '') {
      throw new Error('address can not be empty!')
    }
    return smartweave.contract(contract)
      .connect('use_wallet')
      .bundleInteraction({
        function: 'like',
        transfer: {
          target: address,
          winstonQty: arweave.ar.arToWinston('.004')
        }
      })
      .then(res => {
        console.log(res)
        return res
      })
  }

  function unlike(contract = '', address = '') {
    if (contract === '') {
      throw new Error('contract can not be empty!')
    }
    if (address === '') {
      throw new Error('address can not be empty!')
    }
    return smartweave.contract(contract)
      .connect('use_wallet')
      .bundleInteraction({
        function: 'unlike',
        transfer: {
          target: address,
          winstonQty: '1000000000' //.001 winston
        }
      })
  }

  function likes(contract) {
    return smartweave.contract(contract)
      .connect('use_wallet')
      .readState()
      .then(({ state }) => state.addresses)

  }

  function liked(contract, address) {
    return smartweave.contract(contract)
      .connect('use_wallet')
      .readState()
      .then(({ state }) => state.addresses.includes(address))
  }

  return {
    create,
    like,
    unlike,
    likes,
    liked
  }
}