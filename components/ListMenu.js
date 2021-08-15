const ListMenu = ({ view, setView }) => {
  const renderView = () => {
    if (view === 'created') {
    }
  };
  const active = 'bg-green-400 text-white rounded-full py-1 px-4 shadow-lg';
  const notActive =
    'bg-white text-black border-black border rounded-full py-1 px-4 shadow-lg';
  return (
    <div className="listMenu flex p4 justify-evenly align-center">
      <button
        className={view === 'created' ? active : notActive}
        onClick={() => setView('created')}
      >
        created
      </button>
      <button
        className={view === 'bought' ? active : notActive}
        onClick={() => setView('bought')}
      >
        bought
      </button>
      <button
        className={view === 'sold' ? active : notActive}
        onClick={() => setView('sold')}
      >
        sold
      </button>
    </div>
  );
};

export default ListMenu;
