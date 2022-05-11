import { test, assert } from 'vitest'
import { notes } from '../src/app'
import { load, gql, note, post, waitfor, likes } from './svc-mocks'

//test()

test('get notes by topic', async () => {
  const app = notes({ gql })
  const results = await app.byTopic('dev')
  assert.deepEqual(results,
    [{ id: "1", description: 'Description', title: 'Title', owner: 'owner-address-1', public: true, rev: '1', timestamp: '2022-05-19T00:00:00', topic: '', type: 'note' }]
  )
})

test('get notes by owner', async () => {
  const app = notes({ gql })
  const results = await app.byOwner('owner-address')
  assert.deepEqual(
    results,
    [{ id: "1", description: 'Description', title: 'Title', owner: 'owner-address-1', public: true, rev: '1', timestamp: '2022-05-19T00:00:00', topic: '', type: 'note' }]
  )
})

test('create note', async () => {
  const app = notes({ post, waitfor, likes })
  const result = await app.create(note)
  assert.ok(result)
})

test('get note', async () => {
  const app = notes({ load, likes })
  const tx = await app.get('1')

  assert.equal(tx.id, '1')
  assert.equal(tx.likes, '2')
})


