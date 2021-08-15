import { delBasePath } from 'next/dist/next-server/lib/router/router';
import { Web3Storage } from 'web3.storage';

export function getAccessToken() {
  return process.env.WEB3STORAGE_TOKEN;
}

export function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

export async function retrieve(cid) {
  const client = makeStorageClient();
  const res = await client.get(cid);
  console.log(`Got a response! [${res.status}] ${res.statusText}`);
  if (!res.ok) {
    throw new Error(`failed to get ${cid}`);
  }
  console.log('res: ', res);
  return res;
  // request succeeded! do something with the response object here...
}

export async function storeFiles(files) {
  debugger;
  const client = makeStorageClient();
  const cid = await client.put(files);
  console.log('stored files with cid:', cid);
  return cid;
}

export function makeFileObjects(obj) {
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
  const files = [
    new File(['contents-of-file-1'], 'plain-utf8.txt'),
    new File([blob], 'hello.json'),
  ];
  return files;
}
