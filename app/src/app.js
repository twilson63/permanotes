import { validate, txToNote } from './models/notes.js'
import Async from 'crocks/Async/index.js'
//import { assoc, compose, pluck, path, reverse, sortBy, prop, map } from 'ramda'
import assoc from 'ramda/src/assoc'
import compose from 'ramda/src/compose'
import pluck from 'ramda/src/pluck'
import reverse from 'ramda/src/reverse'
import sortBy from 'ramda/src/sortBy'
import prop from 'ramda/src/prop'
import map from 'ramda/src/map'
import path from 'ramda/src/path'

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
export function notes({ post, waitfor, gql, load, account, likes }) {
  const buildLikes = Async.fromPromise(
    async (tx) => tx.public ? assoc('likeContract', await likes.create(), tx) : tx
  )
  const getLikes = Async.fromPromise(
    async (note) => {
      try {
        return note.public ? assoc('likes', await likes.likes(note.likeContract), note) : note
      } catch (e) {
        console.log('Error', e)
        return note
      }
    }
  )
  // const doPost = Async.fromPromise(async (tx) => await post(tx))
  // const wait = Async.fromPromise(async (tx) => {
  //   await waitfor(tx.id)
  //   return tx
  // })
  //const runQuery = Async.fromPromise(gql)
  //const loadData = Async.fromPromise(load)
  //const getAccount = Async.fromPromise(account)

  async function create(note) {
    return Async.of(note)
      .chain(validate)
      .chain(buildLikes)
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
      .chain(getLikes)
      .toPromise()
  }

  async function getHandle(address) {
    return Async.of(address)
      .chain(Async.fromPromise(account))
      .map(path(['profile', 'name']))
      .toPromise()
  }

  function like(contract, address) {
    return likes.like(contract, address)
  }

  function unlike(contract, address) {
    return likes.unlike(contract, address)
  }

  // function getLikes(contract) {
  //   return likes.likes(contract)
  // }

  return {
    create,
    byOwner,
    byTopic,
    get,
    getHandle,
    like,
    unlike
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