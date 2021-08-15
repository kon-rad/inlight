import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import Header from '../components/Header';
import Nft from '../components/Nft';

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

    const getItem = async (i) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      debugger;
      if (/undefined/.test(tokenUri)) {
        debugger;
        return;
      }
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      const item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
        startTimeStamp: meta.data.startTimeStamp,
        duration: meta.data.duration,
        description: meta.data.description,
      };
      console.log('item: ', meta);
      return item;
    };

    /* map over items returned from smart contract and format
     * them as  well as fetch their token metadata
     */
    const items = await Promise.all((data || []).map(getItem));
    setNfts(items);
    setLoadingState('loaded');
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);

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
  // if (loadingState === 'loaded' && !nfts.length) {
  //   return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
  // }
  return (
    <div>
      <h1 className="my-3 text-4xl font-bold text-center">
        InLight Meditation
      </h1>
      <Header icon="store" title="Store" />
      <div className="flex flex-col align-center pt-4 px-4">
        {nfts.map(
          (nft, i) =>
            nft && <Nft canBuy={true} i={i} nft={nft} buyNft={buyNft} />
        )}
      </div>
    </div>
  );
}
