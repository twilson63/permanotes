import { z } from 'zod'
import Async from 'crocks/Async/index.js';

import compose from 'ramda/src/compose'
import prop from 'ramda/src/prop'
import propEq from 'ramda/src/propEq'
import find from 'ramda/src/find'

const schema = z.object({
  id: z.string().optional(),
  type: z.literal('page').default('page'),
  owner: z.string(),
  contentType: z.literal('text/markdown').default('text/markdown'),
  subdomain: z.string().max(20),
  title: z.string().max(20),
  description: z.string().max(50),
  protocol: z.string().default('PermaPages-v0.2'),
  content: z.string(),
  html: z.string(),
  profile: z.boolean().default(false),
  weavemail: z.boolean().default(false),
  ethwallet: z.string().default(''),
  timestamp: z.string(),
})

const getTag = name => compose(
  prop('value'),
  find(propEq('name', name))
)

export const createPage = (data) => {
  data.timestamp = new Date().toISOString()
  const result = schema.safeParse(data)
  if (result.success) {
    return Async.Resolved(result.data)
  } else {
    return Async.Rejected(result.error.flatten())
  }
}

export const txToPage = (tx) => {
  const tsValue = getTag('Timestamp')(tx.tags)
  const timestamp = tsValue ? tsValue : new Date().toISOString()
  const page = {
    id: tx.id,
    owner: tx.owner.address,
    type: getTag('Type')(tx.tags) || 'page',
    title: getTag('Page-Title')(tx.tags),
    description: getTag('Description')(tx.tags),
    subdomain: getTag('Page-Subdomain')(tx.tags),
    timestamp
  }
  return page
}

export const validate = (data) => {
  data.timestamp = new Date().toISOString()
  const result = schema.safeParse(data)
  if (result.success) {
    return Async.Resolved(result.data)
  } else {
    return Async.Rejected(result.error.flatten())
  }
}