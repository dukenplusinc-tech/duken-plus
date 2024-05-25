type Handler = () => (void | Promise<void>)

export async function saveInvoke(cb: null | undefined | Handler): Promise<void> {
  if (cb) {
    try {
      await cb()
    } catch (e) {
      console.error('[saveInvoke] handled error', e, { error: e })
      // ...
    }
  }
}
