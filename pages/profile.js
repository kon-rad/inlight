import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Web3Modal from 'web3Modal';
import Header from '../components/Header';
import UserDataForm from '../components/UserDataForm';

import { nftMarketAddress, nftAddress } from '../config';

import Market from '../artifacts/contracts/InLightMarket.sol/InLightMarket.json';
import NFT from '../artifacts/contracts/InLightNFT.sol/InLightNFT.json';

export default function MeditationDashboard() {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftMarketAddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const data = await marketContract.fetchItemsCreated();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          sold: i.sold,
          image: meta.data.image,
        };
        return item;
      })
    );
    /* create a filtered array of items that have been sold */
    const soldItems = items.filter((i) => i.sold);
    setSold(soldItems);
    setNfts(items);
    setLoadingState('loaded');
  }
  // if (loadingState === 'loaded' && !nfts.length) {
  //   return <h1 className="py-10 px-20 text-3xl">No assets created</h1>;
  // }
  return (
    <div>
      <div className="p-4">
        <Header icon="user" title="Profile" />
        <UserDataForm />
      </div>
    </div>
  );
}
