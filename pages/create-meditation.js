import { useState, useContext } from 'react';
import { UserContext } from '../components/userContext';
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
import { data } from 'autoprefixer';

const Stages = {
  START: 'START',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

export default function CreateMeditation() {
  const { user, setUser } = useContext(UserContext);
  const [fileUrl, setFileUrl] = useState(null);
  const [stage, setStage] = useState(Stages.START);
  const [time, setTime] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(600);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [formInput, updateFormInput] = useState({
    description: '',
    firstName: '',
    lastName: '',
    duration: '',
    latitude: '',
    longitude: '',
    timeStamp: '',
  });
  const [meditationData, setMeditationData] = useState({
    duration: '',
    startTimeStamp: '',
    endTimeStamp: '',
    price: '',
    avatarBase64: '',
  });
  const router = useRouter();
  useInterval(
    () => {
      if (time - 1 <= 0) {
        setMeditationData((data) => ({
          ...data,
          endTimeStamp: new Date().toISOString(),
          duration: secondsToMMSS(initialTime),
          // set default price to 0.1 ETH per minute
          price: String((initialTime / 60) * 0.1),
        }));
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
    if (!e || !e.target || !e.target.files || !e.target.files[0]) {
      setFileUrl(null);
      return;
    }
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
    const { firstName, lastName } = user;
    const { price } = meditationData;
    if (!firstName || !lastName || !price) {
      return;
    }
    const imageData = fileUrl ? fileUrl : meditationData.avatarBase64;

    /* first, upload to IPFS */
    const data = JSON.stringify({
      ...user,
      ...meditationData,
      image: imageData,
    });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on blockchain */
      createSale(url);
      console.log('ipfs url: ', url);
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
    const value = event.args[2];
    const tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(meditationData.price, 'ether');

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
    setMeditationData((data) => ({
      ...data,
      startTimeStamp: new Date().toISOString(),
    }));
    setIsRunning(true);
  }

  const secondsToMMSS = (time) => {
    const m = Math.floor(time / 60);
    let s = time % 60;
    s = s < 10 ? `0${s}` : s;
    return `${m}:${s}`;
  };

  const handleMeditationDataChange = (key, val) => {
    setMeditationData((data) => ({ ...data, [key]: val }));
  };

  if (stage === Stages.COMPLETED) {
    return (
      <div className="flex flex-col p-5">
        <div className="text-2xl font-bold mt-4 text-center">
          Completed <br />
          {secondsToMMSS(initialTime)}
          <Icon
            name="checkmark"
            svgClassName="meditation__checkmark"
            fill="#34D399"
          />
        </div>
        <div className="p-4 mt-3">
          <UserDataForm />
          <MeditationForm
            onImageUpload={handleImageUpload}
            fileUrl={fileUrl}
            meditationData={meditationData}
            onMeditationDataChange={handleMeditationDataChange}
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
