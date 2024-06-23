type Handler = () => void | Promise<void>;

export async function safeInvoke(
  cb: null | undefined | Handler
): Promise<void> {
  if (cb) {
    try {
      await cb();
    } catch (e) {
      console.error('[safeInvoke] handled error', e, { error: e });
      // ...
    }
  }
}
