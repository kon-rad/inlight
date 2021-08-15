import { NFTStorage, File } from 'nft.storage';

export function getAccessToken() {
  return process.env.NFT_STORAGE_APIKEY;
}

export function makeStorageClient() {
  console.log('getAccessToken(): ', getAccessToken());
  return new NFTStorage({ token: getAccessToken() });
}

export const storeNft = async (file) => {
  debugger;
  const client = makeStorageClient();
  const metadata = await client.store({
    ...file,
  });
  console.log(metadata.url);
  return metadata;
};
// ipfs://bafyreib4pff766vhpbxbhjbqqnsh5emeznvujayjj4z2iu533cprgbz23m/metadata.json
