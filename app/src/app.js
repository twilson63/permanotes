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
import head from 'ramda/src/head'
//import propEq from 'ramda/src/propEq'

/** 
 * Permanotes application 
 * 
 * Features:
 * - create
 * - like
 * - unlike
 * - byOwner
 * - byTopic
 * - getProfile
 * - byProfile 
 * 
 * - get
*/
export function notes({ post, waitfor, gql, load, account, handle, likes }) {
  const buildLikes = Async.fromPromise(
    async (tx) => tx.public ? assoc('likeContract', await likes.create().catch(_e => ''), tx) : tx
  )
  const getLikes = Async.fromPromise(
    async (note) => {
      try {
        return (note.public && note.likeContract) ? assoc('likes', await likes.likes(note.likeContract), note) : note
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
      //.chain(buildLikes) SWC are not working consistently
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
      //.map(map(propEq('public', false)))
      .toPromise()
  }

  async function get(id) {
    return Async.of(id)
      .chain(Async.fromPromise(load))
      .chain(getLikes)
      .toPromise()
  }

  async function getProfile(h) {
    return Async.of(h)
      .chain(Async.fromPromise(handle))
      .map(x => (console.log(x), x))
      //.map(() => ({ profile: { handle: 'rakis', address: 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI' } }))
      .map(compose(prop('profile'), head))
      .toPromise()
  }

  async function byProfile(h) {
    return Async.of(h)
      .chain(Async.fromPromise(handle))
      .map(compose(path(['profile', 'addr']), head))
      .map(buildProfileQuery)
      .chain(Async.fromPromise(gql))
      .map(pluckNodes)
      .map(formatNotes)
      .toPromise()
  }

  async function getHandle(address) {
    return Async.of(address)
      .chain(Async.fromPromise(account))
      .map(path(['profile', 'name']))
      .toPromise()
  }

  function like(contract, address) {
    if (!contract) { return }
    return likes.like(contract, address)
  }

  function unlike(contract, address) {
    if (!contract) { return }
    return likes.unlike(contract, address)
  }

  // function getLikes(contract) {
  //   return likes.likes(contract)
  // }

  async function history() {
    return Async.of()
      .map(buildDeployHx)
      .chain(Async.fromPromise(gql))
      .map(pluckNodes)
      .toPromise()
  }
  return {
    create,
    byOwner,
    byTopic,
    get,
    getHandle,
    like,
    unlike,
    getProfile,
    byProfile,
    history
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
  transactions(first:100, owners: ["${owner}"], tags: { name: "Protocol", values: ["PermaNotes-v0.1", "PermaNotes-v0.2"]}) {
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
  transactions(first: 100, tags: [
    { name: "Protocol", values: ["PermaNotes-v0.1","PermaNotes-v0.2"]},
    { name: "Note-Topic", values: ["${topic}"]},
    { name: "Note-Public", values: ["true"]}
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

function buildProfileQuery(address) {
  console.log({ address })
  return `
query {
  transactions(
    first: 100, 
    owners: ["${address}"],
    tags: [
      { name: "Protocol", values: ["PermaNotes-v0.1", "PermaNotes-v0.2"]},
      { name: "Note-Public", values: ["true"]}
    ]
  ) {
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

function buildDeployHx() {
  return `
query {
  transactions(tags: [
    {name:"DEPLOY", values:["permanotes"]},
    {name:"Content-Type", values:["application/x.arweave-manifest+json"]}
  ]) {
    edges {
      node {
        id
      }
    }
  }
}
  `
}