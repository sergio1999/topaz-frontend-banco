const TARGET_URL =
  process.env.API_TARGET_URL ?? 'https://qf5k9fspl0.execute-api.us-east-1.amazonaws.com/default';

export async function POST(request: Request) {
  const response = await fetch(`${TARGET_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: await request.text(),
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('Content-Type') ?? 'application/json' },
  });
}
