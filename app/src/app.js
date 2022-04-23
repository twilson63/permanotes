import { validate, txToNote } from './models/notes.js'
import Async from 'crocks/Async/index.js'
import { compose, pluck, path, reverse, sortBy, prop, map } from 'ramda'
/** 
 * Permanotes application 
 * 
 * Features:
 * - create
 * - like
 * - unlike
 * - byOwner
 * - byTopic
 * - get
*/
export function notes({ post, waitfor, gql, load, account }) {
  async function create(note) {
    return Async.of(note)
      .chain(validate)
      .chain(Async.fromPromise(post))
      .chain(tx => Async.fromPromise(waitfor)(tx.id))
      .toPromise()
  }

  async function byOwner(owner) {
    return Async.of(owner)
      .map(buildOwnerQuery)
      .chain(Async.fromPromise(gql))
      .map(pluckNodes)
      .map(formatNotes)
      .toPromise()
  }

  async function byTopic(topic) {
    return Async.of(topic)
      .map(buildTopicQuery)
      .chain(Async.fromPromise(gql))
      .map(pluckNodes)
      .map(formatNotes)
      .toPromise()
  }

  async function get(id) {
    return Async.of(id)
      .chain(Async.fromPromise(load))
      .toPromise()
  }

  async function getHandle(address) {
    return Async.of(address)
      .chain(Async.fromPromise(account))
      .map(path(['profile', 'name']))
      .toPromise()
  }

  return {
    create,
    byOwner,
    byTopic,
    get,
    getHandle
  }
}

function formatNotes(nodes) {
  return compose(
    reverse,
    sortBy(prop("timestamp")),
    map(txToNote)
  )(nodes)
}

function pluckNodes(results) {
  return compose(
    pluck('node'),
    path(['data', 'data', 'transactions', 'edges'])
  )(results)
}

function buildOwnerQuery(owner) {
  return `
query {
  transactions(owners: ["${owner}"], tags: { name: "Protocol", values: ["PermaNotes-v0.1"]}) {
    edges {
      node {
        id
        owner {
          address
        }
        tags {
          name
          value
        }
      }
    }
  }
}
  `
}

function buildTopicQuery(topic) {
  return `
query {
  transactions(tags: [
    { name: "Protocol", values: ["PermaNotes-v0.1"]},
    { name: "Note-Topic", values: ["${topic}"]}
  ]) {
    edges {
      node {
        id
        owner {
          address
        }
        tags {
          name
          value
        }
      }
    }
  }
}
  `
}