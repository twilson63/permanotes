import { z } from 'zod'

const schema = z.object({
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


export const createNote = (data) => {
  return schema.parse(data)
}