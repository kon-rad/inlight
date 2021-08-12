import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

import { nftAddress, nftMarketAddress } from '../config';

import NFT from '../artifacts/contracts/InLightNFT.sol/InLightNFT.json';
import Market from '../artifacts/contracts/InLightMarket.sol/InLightMarket.json';

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: '',
    name: '',
    description: '',
  });
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log(`Error uploading file: ${error}`);
    }
  }
  async function createMarket() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) {
      return;
    }
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass teh URL to save it on blockchain */
      createSale(url);
    } catch (error) {
      console.log(`Error uploading file: ${error}`);
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    const contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    const transaction = await contract.createToken(url);
    const tx = await transaction.wait();
    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, 'ether');

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftMarketAddress, Market.abi, singer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftAddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    router.push('/');
  }

  return (
    <div className="flex justify-center">
      <div className="w-12 flex flex-col pb-12">
        <input
          type="text"
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          type="text"
          placeholder="Asset Description"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Asset Price in Eth"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
        <button
          onClick={createMarket}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create Digital Asset
        </button>
      </div>
    </div>
  );
}