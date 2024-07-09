import { LocalStorageRepository } from 'infrastructure/repositories/LocalStorageRepository'

import { atom } from 'jotai'
import { StorageParseError, StorageSyncError } from 'domain/errors/StorageError'
import { isPromise } from 'utils/utils'
import { Item } from '@portalbase/domain'
import { UserResponse } from '@portalbase/application'

type UpdateFunction<T> = (oldValue: T) => T | undefined
type UpdateParam<T> = UpdateFunction<T> | T
type DataOrPromise<T> = T | Promise<T>

export interface AuthState {
  user?: UserResponse
  loggedIn: boolean
}
export type ItemAtom = Item
export interface Success {
  message: string
}

export const errorAtom = atom<Error | null>(null)
export const successAtom = atom<Success | null>(null)

type LoadParser<T> = (value: T) => T
type SaveParser<T> = (value: T) => { [key: string]: any }

type AsyncStorageParsers<T> = {
  loadParser?: LoadParser<T>
  saveParser?: SaveParser<T>
}

const atomWithAsyncStorage = <T extends unknown>(key: string, initialValue: T, parsers?: AsyncStorageParsers<T>) => {
  const localStorageRepository = new LocalStorageRepository<T>()
  const loadParser = parsers?.loadParser ? parsers.loadParser : (value: T) => value
  const saveParser = parsers?.saveParser ? parsers.saveParser : (value: T) => value
  const baseAtom = atom<DataOrPromise<T>>(
    localStorageRepository.getById(key).then((result) => {
      return result ? loadParser(result) : initialValue
    })
  )
  const derivedAtom = atom(
    (get) => get(baseAtom), // do not set this to async, it will cause the page to jump on each re-render
    (get, set, update: UpdateParam<T>) => {
      const getNextValue = (oldValue: T) => {
        const parsedValue = update instanceof Function ? update(oldValue) : (update as T)
        return parsedValue ? parsedValue : oldValue
      }
      const insertToStore = (nextValue: T) => {
        try {
          localStorageRepository
            .save(saveParser(nextValue) as T, key)
            .then(() => {
              set(baseAtom, nextValue)
            })
            .catch((error) => {
              console.error(error)
              set(errorAtom, new StorageSyncError(error && error.message ? error.message : error))
            })
        } catch (error) {
          set(errorAtom, new StorageParseError(error?.toString()))
        }
      }
      const oldValueDataOrPromise = get(baseAtom)
      if (isPromise(oldValueDataOrPromise)) {
        oldValueDataOrPromise.then((oldValue) => {
          const nextValue = getNextValue(oldValue)
          set(baseAtom, nextValue)
          insertToStore(nextValue)
        })
      } else {
        const nextValue = getNextValue(oldValueDataOrPromise)
        set(baseAtom, nextValue)
        insertToStore(nextValue)
      }
    }
  )
  return derivedAtom
}

export const authAtom = atomWithAsyncStorage<AuthState>('authState', { loggedIn: false })
