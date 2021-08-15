import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import Header from '../components/Header';
import ListMenu from '../components/ListMenu';
import Nft from '../components/Nft';

import { nftMarketAddress, nftAddress } from '../config';

import Market from '../artifacts/contracts/InLightMarket.sol/InLightMarket.json';
import NFT from '../artifacts/contracts/InLightNFT.sol/InLightNFT.json';
import { render } from 'react-dom';

export default function MyMeditations() {
  const [createdNfts, setCreatedNfts] = useState([]);
  const [soldNfts, setSoldNfts] = useState([]);
  const [boughtNfts, setBoughtNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [view, setView] = useState('created');
  useEffect(() => {
    loadBoughtNFTs();
    loadCreatedAndSoldNFTs();
  }, []);
  async function loadBoughtNFTs() {
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
    const data = await marketContract.fetchMyNFTs();

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
          image: meta.data.image,
        };
        return item;
      })
    );
    setBoughtNfts(items);
    setLoadingState('loaded');
  }

  async function loadCreatedAndSoldNFTs() {
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
    setSoldNfts(soldItems);
    setCreatedNfts(items);
    setLoadingState('loaded');
  }

  const renderList = () => {
    let list = [];
    if (view === 'created') {
      list = createdNfts;
    } else if (view === 'bought') {
      list = boughtNfts;
    } else {
      list = soldNfts;
    }
    return list.map((nft, i) => <Nft key={i} nft={nft} />);
  };
  // if (loadingState === 'loaded' && !nfts.length) {
  //   return <h1 className="py-10 px-20 text-3xl">No meditations owned</h1>;
  // }
  return (
    <div>
      <Header icon="list" title="List" />
      <ListMenu view={view} setView={setView} />
      <div className="flex flex-col p-4">{renderList()}</div>
    </div>
  );
}
