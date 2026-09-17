#!/usr/bin/env node

import webPush from 'web-push'

const { publicKey, privateKey } = webPush.generateVAPIDKeys()

console.log('Add these to backend/.env and restart the backend:\n')
console.log(`VAPID_PUBLIC_KEY=${publicKey}`)
console.log(`VAPID_PRIVATE_KEY=${privateKey}\n`)
console.log('Optional override (defaults to mailto:push@routines.jgirvin.com):\n')
console.log('VAPID_SUBJECT=mailto:you@example.com')
