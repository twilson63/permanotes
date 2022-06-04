import { writable } from 'svelte/store'

export const address = writable('')

export const account = writable({})

export const topics = writable([])

export const notecache = writable([])