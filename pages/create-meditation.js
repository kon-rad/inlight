import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import Header from '../components/Header';
import Icon from '../components/Icon';
import UserDataForm from '../components/UserDataForm';
import MeditationForm from '../components/MeditationForm';
import useInterval from '../hooks/useInterval';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

import { nftAddress, nftMarketAddress } from '../config';

import NFT from '../artifacts/contracts/InLightNFT.sol/InLightNFT.json';
import Market from '../artifacts/contracts/InLightMarket.sol/InLightMarket.json';

const Stages = {
  START: 'START',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

export default function CreateMeditation() {
  const [fileUrl, setFileUrl] = useState(null);
  const [stage, setStage] = useState(Stages.START);
  const [time, setTime] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(600);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTimeStamp, setStartTimeStamp] = useState('');
  const [endTimeStamp, setEndTimeStamp] = useState('');
  const [formInput, updateFormInput] = useState({
    price: '',
    name: '',
    description: '',
    firstName: '',
    lastName: '',
    duration: '',
    latitude: '',
    longitude: '',
    timeStamp: '',
  });
  const router = useRouter();
  useInterval(
    () => {
      if (time - 1 <= 0) {
        setEndTimeStamp(new Date().toISOString());
        setIsRunning(false);
        setTime(initialTime);
        setStage(Stages.COMPLETED);
      } else {
        setTime((time) => time - 1);
      }
    },
    isRunning ? 1000 : null
  );

  async function handleImageUpload(e) {
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
      /* after file is uploaded to IPFS, pass the URL to save it on blockchain */
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
    let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    const tx = await transaction.wait();
    if (tx.events.length < 1) {
      console.error('tx has no events. tx: ', tx);
      return;
    }
    const event = tx.events[0];
    console.log('tx: ', tx);
    console.log('tx.events: ', tx.events);
    console.log('event: ', event);
    const value = event.args[2];
    const tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formInput.price, 'ether');

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftAddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    router.push('/');
  }
  function startTimer() {
    if (isRunning) {
      setIsRunning(false);
      setTime(initialTime);
      return;
    }
    setStartTimeStamp(new Date().toISOString());
    setIsRunning(true);
  }

  const secondsToMMSS = (time) => {
    const m = Math.floor(time / 60);
    let s = time % 60;
    s = s < 10 ? `0${s}` : s;
    return `${m}:${s}`;
  };

  if (stage === Stages.START) {
    return (
      <div>
        <Header icon="meditate" title="Meditate" />
        <div className="flex justify-center">
          <div className="w-1/2 flex flex-col pb-12">
            <div className="timer flex justify-center items-center">
              <span className="timer__time text-4xl font-bold text-center">
                {secondsToMMSS(time)}
              </span>
            </div>
            <div className="flex items-center justify-evenly">
              <button
                onClick={startTimer}
                className="font-bold bg-green-400 text-white rounded-full py-3 px-6 shadow-lg"
              >
                Start
              </button>
              <Icon name="volume-up" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (stage === Stages.COMPLETED) {
    return (
      <div className="flex flex-col p-5">
        <div className="text-2xl font-bold mt-4 text-center">
          Completed <br />
          {secondsToMMSS(initialTime)}
        </div>
        <div className="p-4 mt-3">
          <UserDataForm />
          <MeditationForm
            startTimeStamp={startTimeStamp}
            endTimeStamp={endTimeStamp}
            duration={secondsToMMSS(initialTime)}
            onImageUpload={handleImageUpload}
          />
        </div>
        <button
          onClick={createMarket}
          className="font-bold mt-4 bg-green-400 text-white rounded p-4 shadow-lg"
        >
          Create Meditation Asset
        </button>
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
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
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
        <button
          onClick={createMarket}
          className="font-bold mt-4 bg-green-400 text-white rounded p-4 shadow-lg"
        >
          Create Digital Asset
        </button>
      </div>
    </div>
  );
}
