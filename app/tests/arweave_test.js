import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { arweave, connectApp } from '../src/services/arweave.js'


test('ArWeave Init', async () => {
  const result = await arweave.network.getInfo()
  assert.is(result.network, 'arweave.N.1')
})

// test('ArWeave App Connect', async () =>
//   connectApp().catch(err => {
//     assert.is(err.message, 'window is not defined')
//   })

// )



test.run()