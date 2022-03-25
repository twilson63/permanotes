import { z } from 'zod'

const schema = z.object({
  type: z.literal('note').default('note'),
  owner: z.string(),
  version: z.literal('0.1').default('0.1'),
  contentType: z.literal('text/markdown').default('text/markdown'),
  title: z.string(),
  description: z.string(),
  protocol: z.literal('PermaNote-Test').default('PermaNote-Test'),
  content: z.string(),
  public: z.boolean(),
  tags: z.string().array()
})


export const createNote = (data) => {
  return schema.parse(data)
}