import { z } from 'zod'

const schema = z.object({
  tx: z.string(),
  type: z.literal('note'),
  version: z.string(),
  contentType: z.literal('text/markdown'),
  title: z.string(),
  description: z.string(),
  protocol: z.literal('PermaNote-0.1'),
  content: z.string(),
  public: z.boolean(),
  tags: z.string().array()
})

