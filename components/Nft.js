const Nft = ({ key, nft, canBuy = false, buyNft }) => {
  console.log('nft: ', nft);
  return (
    <div
      key={key}
      className="border shadow rounded-xl overflow-hidden mb-4 mt-2 flex"
    >
      <div className="w-28">
        <img
          src={nft.image}
          alt=""
          className="rounded-xl w-28 overflow-hidden"
        />
      </div>
      <div className="p-2 h-28 overflow-hidden flex flex-1">
        <div className="flex-1">
          <div className="flex flex-1 justify-between">
            <div className="text-sm">on: {nft.startTimeStamp}</div>
            {canBuy && (
              <button
                className="bg-green-400 text-white rounded-full py-1 px-4 shadow-lg"
                onClick={() => buyNft(nft)}
              >
                Buy
              </button>
            )}
          </div>
          <p className="text-sm">duration: {nft.startTimeStamp}</p>

          <p className="text-sm text-gray-400">
            description: {nft.description}
          </p>
          <p className="text-lg">{nft.price} ETH</p>
        </div>
      </div>
    </div>
  );
};

export default Nft;
