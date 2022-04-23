import { validate } from './models/notes.js'
import { Async } from 'crocks'
/** 
 * Permanotes application 
 * 
 * Features:
 * - createNote
 * - likeNote
 * - byWallet
 * - byTopic
 * - getNote
*/
export function notes(arweave) {
  async function createNote(note) {
    return Async.of(note)
      .map(validate)
      .chain(arweave.postTx)
      .chain(arweave.payment)
      .toPromise()
  }
  return {
    createNote
  }
}