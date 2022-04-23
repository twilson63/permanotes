import { test } from 'uvu';
import * as assert from 'uvu/assert';
import Async from 'crocks/Async/index.js'
import { notes } from '../src/app.js'

const arweave = {
  post: () => Promise.resolve({ tx: '1' }),
  waitfor: () => Promise.resolve(true),
  payment: () => Promise.resolve({ ok: true })
}

test('create note successfully', async () => {
  const { create } = notes(arweave)
  const result = await create({
    owner: '1',
    title: 'Hello World',
    description: 'some description',
    content: 'Some Content',
    public: false
  })
  console.log(result)
  assert.ok(true)
})

test.run()