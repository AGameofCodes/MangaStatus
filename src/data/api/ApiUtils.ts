export function handleJsonResponse(res: Primise<T>): Promise<T> {
  return res.then(async e => {
    if (e.status === 200) {
      return await e.json();
    }
    throw new Error('Api error ' + e.status + ': ' + await e.text());
  });
}