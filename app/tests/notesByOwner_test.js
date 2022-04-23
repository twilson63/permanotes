import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { notes } from '../src/app.js'

const arweave = {
  gql: () => Promise.resolve({
    data: {
      data: {
        transactions: {
          edges: [{
            node: {
              id: '1',
              owner: { address: '1' },
              tags: [{
                name: 'Note-Title',
                value: 'Test'
              }, {
                name: 'Type',
                value: 'note'
              }, {
                name: 'Note-Topic',
                value: 'test-topic'
              }, {
                name: 'Note-Rev',
                value: '1'
              }, {
                name: 'Description',
                value: 'description'
              }]
            }
          }]
        }
      }
    }
  })
}

test('get notes by owner', async () => {
  const results = await notes(arweave).byOwner('1')
  console.log(results)
  assert.ok(true)
})

test.run()