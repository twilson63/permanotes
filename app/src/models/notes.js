import { z } from 'zod'
import { compose, prop, propEq, find } from 'ramda';

const schema = z.object({
  id: z.string().optional(),
  type: z.literal('note').default('note'),
  owner: z.string(),
  rev: z.string().default('1'),
  contentType: z.literal('text/markdown').default('text/markdown'),
  title: z.string().max(20),
  description: z.string().max(50),
  protocol: z.literal('PermaNote-Test').default('PermaNote-Test'),
  content: z.string(),
  public: z.boolean(),
  topic: z.string()
})

const getTag = name => compose(
  prop('value'),
  find(propEq('name', name))
)

export const createNote = (data) => {
  return schema.parse(data)
}

export const txToNote = (tx) => {
  console.log(tx)
  const note = {
    id: tx.id,
    title: getTag('Note-Title')(tx.tags),
    description: getTag('Description')(tx.tags),
    topic: getTag('Note-Topic')(tx.tags),
    rev: getTag('Note-Rev')(tx.tags),
  }
  return note
}