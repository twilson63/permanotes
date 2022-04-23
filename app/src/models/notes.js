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
  protocol: z.literal('PermaNotes-v0.1').default('PermaNotes-v0.1'),
  content: z.string(),
  public: z.boolean().default(false),
  topic: z.string().optional(),
  timestamp: z.string()
})

const getTag = name => compose(
  prop('value'),
  find(propEq('name', name))
)

export const createNote = (data) => {
  data.timestamp = new Date().toISOString()
  return schema.parse(data)
}

export const txToNote = (tx) => {
  const tsValue = getTag('Timestamp')(tx.tags)
  const timestamp = tsValue ? tsValue : new Date().toISOString()
  const note = {
    id: tx.id,
    title: getTag('Note-Title')(tx.tags),
    description: getTag('Description')(tx.tags),
    topic: getTag('Note-Topic')(tx.tags),
    rev: getTag('Note-Rev')(tx.tags),
    timestamp
  }
  return note
}