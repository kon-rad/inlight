import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';

import { nftAddress, nftMarketAddress } from '../config';

import NFT from '../artifacts/contracts/InLightNFT.sol/InLightNFT.json';
import Market from '../artifacts/contracts/InLightMarket.sol/InLightMarket.json';

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    debugger;
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftMarketAddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();
    console.log('data: ', data);

    /* map over items returned from smart contract and format
     * them as  well as fetch their token metadata
     */
    const items = await Promise.all(
      (data || []).map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        console.log('meta: ', meta);
        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState('loaded');
  }
  async function buyNft(nft) {
    debugger;

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);
    debugger;

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(
      nftAddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFTs();
  }
  if (loadingState === 'loaded' && !nfts.length) {
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
  }
  return (
    <div className="flex justify-center">
      <div className="px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div className="border shadow rounded-xl overflow-hidden mb-4 mt-2">
              <img src={nft.image} alt="" />
              <div className="p-4">
                <p className="text-2xl font-semibold">{nft.name}</p>
                <div>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">
                  {nft.price} ETH
                </p>
                <button
                  className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => buyNft(nft)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
