const FOURTEEN_MINUTES_MS = 14 * 60 * 1000;

const resolvePingUrl = (): string | null => {
  const base =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.KEEP_ALIVE_URL ||
    process.env.SERVER_URL;

  if (!base) return null;

  const trimmed = base.replace(/\/$/, '');
  return `${trimmed}/api/health`;
};

export const startKeepAlive = (): void => {
  if (process.env.DISABLE_KEEP_ALIVE === 'true') return;
  if (process.env.NODE_ENV !== 'production') return;

  const pingUrl = resolvePingUrl();
  if (!pingUrl) {
    console.warn(
      'Keep-alive disabled: set RENDER_EXTERNAL_URL (auto on Render) or KEEP_ALIVE_URL',
    );
    return;
  }

  const ping = async (): Promise<void> => {
    try {
      const response = await fetch(pingUrl);
      if (!response.ok) {
        console.warn(`Keep-alive ping failed: ${response.status}`);
        return;
      }
      console.log(`Keep-alive ping ok (${new Date().toISOString()})`);
    } catch (error) {
      console.warn('Keep-alive ping error:', error);
    }
  };

  void ping();
  setInterval(() => {
    void ping();
  }, FOURTEEN_MINUTES_MS);

  console.log(`Keep-alive started — pinging every 14 min: ${pingUrl}`);
};
