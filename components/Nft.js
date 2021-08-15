import formatDate from '../utilities/formatDate';

const Nft = ({ i, nft, canBuy = false, buyNft }) => {
  console.log('nft: ', nft);
  return (
    <div
      key={i}
      className="border shadow rounded-xl overflow-hidden mb-4 mt-2 flex"
    >
      <div className="w-28 h-28 overflow-hidden">
        <img
          src={nft.image}
          alt=""
          className="rounded-xl w-28 h-28 overflow-hidden"
        />
      </div>
      <div className="p-2 h-28 overflow-hidden flex flex-1">
        <div className="flex-1">
          <div className="text-sm text-gray-400">
            {formatDate(nft.startTimeStamp)}
          </div>
          <p className="text-sm">duration: {nft.duration}</p>

          <p className="text-sm text-gray-400">{nft.description}</p>
          <div className="flex flex-1 justify-between">
            <p className="text-lg">{nft.price} ETH</p>
            {canBuy && (
              <button
                className="bg-green-400 text-white rounded-full py-1 px-4 shadow-lg"
                onClick={() => buyNft(nft)}
              >
                Buy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nft;
