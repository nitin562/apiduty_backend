import { Connection, Client } from '@temporalio/client';

let client = null;

export async function getTemporalClient() {
  if (client) return client;
  const connection = await Connection.connect(); //timeout is default 10
  client = new Client({ connection });
  return client;
}
