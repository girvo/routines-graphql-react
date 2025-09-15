import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { createYoga } from 'graphql-yoga'

const app = fastify({ logger: true })
