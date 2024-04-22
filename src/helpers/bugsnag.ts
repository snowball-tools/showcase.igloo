import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact, { BugsnagErrorBoundary } from '@bugsnag/plugin-react'
import { track } from '@vercel/analytics/server'
import React from 'react'

import { BUGSNAG_ENABLED, IS_DEBUG } from './constants'

export let ErrorBoundary: BugsnagErrorBoundary

export function start() {
  if (!BUGSNAG_ENABLED) {
    return
  }
  if (ErrorBoundary) {
    IS_DEBUG ? console.log('Bugsnag already started') : null
    return
  }
  Bugsnag.start({
    apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY as string,
    plugins: [new BugsnagPluginReact()],
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION as string,
    releaseStage: process.env.NODE_ENV,
  })
  const reactPlugin = Bugsnag.getPlugin('react')
  if (reactPlugin) {
    ErrorBoundary = reactPlugin.createErrorBoundary(React)
  }
}

export function logInfo(where: string, message: string) {
  IS_DEBUG
    ? console.log(`[logInfo][where: ${where}] ${message}`)
    : track(`[logInfo][where: ${where}] ${message}`)
  BUGSNAG_ENABLED && Bugsnag.addMetadata('log', where, message)
}

export function logWarning(message: string) {
  IS_DEBUG ? console.warn(`[logWarning] ${message}`) : null
  BUGSNAG_ENABLED && Bugsnag.notify(new Error(message))
}

export function logErrorMsg(message: string) {
  IS_DEBUG ? console.error(`[logErrorMsg] ${message}`) : null
  BUGSNAG_ENABLED && Bugsnag.notify(new Error(message))
}

export function logMetadata(about: string, key: string, value: string) {
  IS_DEBUG ? console.log(`[logMetadata][about: ${about}] ${key}: ${value}`) : null
  BUGSNAG_ENABLED && Bugsnag.addMetadata(about, key, value)
}

export function logError(error: Error) {
  IS_DEBUG ? console.error(`[logError] ${JSON.stringify(error)}`) : null
  BUGSNAG_ENABLED && Bugsnag.notify(error)
}

export function startSession() {
  IS_DEBUG ? console.log(`[startSession] debug`) : null
  BUGSNAG_ENABLED && Bugsnag.startSession()
}

export function logUser(id: string, username: string) {
  IS_DEBUG ? console.log(`[logUser] ${id}: ${username}`) : track(`[logUser] ${id}: ${username}`)
  BUGSNAG_ENABLED && Bugsnag.setUser(id, username)
}
