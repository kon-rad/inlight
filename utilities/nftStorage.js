import { NFTStorage, File } from 'nft.storage';

export function getAccessToken() {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGQzMTYyM2VhMDQwY0Q5RTkyNWQ5NDI4MjJFMGU3ZDg4QTRDMUY5NWMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyOTA0NzA2NDE4MSwibmFtZSI6ImlubGlnaHRNZWRpdGF0aW9uIn0.p0zdbObm_MDFvxM83UDrT_BfmYjtO5CxWD4LHvrvvPw';
}

export function makeStorageClient() {
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
