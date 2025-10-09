export function createContext() {
  return {
    blah: 'this is very cool',
  }
}

export type Context = ReturnType<typeof createContext>
