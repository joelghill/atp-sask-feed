/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { lexicons } from '../../../../lexicons.js'
import { isObj, hasProp } from '../../../../util.js'
import { CID } from 'multiformats/cid'
import * as ComAtprotoRepoStrongRef from '../../../com/atproto/repo/strongRef.js'
import * as AppBskyFeedDefs from '../feed/defs.js'
import * as AppBskyActorDefs from '../actor/defs.js'
import * as ComAtprotoLabelDefs from '../../../com/atproto/label/defs.js'
import * as AppBskyEmbedImages from './images.js'
import * as AppBskyEmbedExternal from './external.js'
import * as AppBskyEmbedRecordWithMedia from './recordWithMedia.js'

export interface Main {
  record: ComAtprotoRepoStrongRef.Main
  [k: string]: unknown
}

export function isMain(v: unknown): v is Main {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'app.bsky.embed.record#main' ||
      v.$type === 'app.bsky.embed.record')
  )
}

export function validateMain(v: unknown): ValidationResult {
  return lexicons.validate('app.bsky.embed.record#main', v)
}

export interface View {
  record:
    | ViewRecord
    | ViewNotFound
    | ViewBlocked
    | AppBskyFeedDefs.GeneratorView
    | { $type: string; [k: string]: unknown }
  [k: string]: unknown
}

export function isView(v: unknown): v is View {
  return (
    isObj(v) && hasProp(v, '$type') && v.$type === 'app.bsky.embed.record#view'
  )
}

export function validateView(v: unknown): ValidationResult {
  return lexicons.validate('app.bsky.embed.record#view', v)
}

export interface ViewRecord {
  uri: string
  cid: string
  author: AppBskyActorDefs.ProfileViewBasic
  value: {}
  labels?: ComAtprotoLabelDefs.Label[]
  embeds?: (
    | AppBskyEmbedImages.View
    | AppBskyEmbedExternal.View
    | View
    | AppBskyEmbedRecordWithMedia.View
    | { $type: string; [k: string]: unknown }
  )[]
  indexedAt: string
  [k: string]: unknown
}

export function isViewRecord(v: unknown): v is ViewRecord {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'app.bsky.embed.record#viewRecord'
  )
}

export function validateViewRecord(v: unknown): ValidationResult {
  return lexicons.validate('app.bsky.embed.record#viewRecord', v)
}

export interface ViewNotFound {
  uri: string
  [k: string]: unknown
}

export function isViewNotFound(v: unknown): v is ViewNotFound {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'app.bsky.embed.record#viewNotFound'
  )
}

export function validateViewNotFound(v: unknown): ValidationResult {
  return lexicons.validate('app.bsky.embed.record#viewNotFound', v)
}

export interface ViewBlocked {
  uri: string
  [k: string]: unknown
}

export function isViewBlocked(v: unknown): v is ViewBlocked {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'app.bsky.embed.record#viewBlocked'
  )
}

export function validateViewBlocked(v: unknown): ValidationResult {
  return lexicons.validate('app.bsky.embed.record#viewBlocked', v)
}
