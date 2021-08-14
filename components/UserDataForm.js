import InlineEdit from './InlineEdit';
import { useContext } from 'react';
import { UserContext } from './userContext';
import Icon from './Icon';

const UserDataForm = () => {
  const { user, setUser } = useContext(UserContext);
  console.log('user: ', user, setUser);
  const handleSetText = (key, val) => {
    const newUser = {
      ...user,
      [key]: val,
    };
    setUser(newUser);
    console.log('change newUser: ', newUser);
  };
  const handleLocationUpdate = (e) => {
    console.log('e: ', e);
  };
  return (
    <div className="mt-2">
      <div className="mb-2">
        <h3 className="text-lg font-bold mb-2">Name:</h3>
        <div className="flex flex-col">
          <div className="flex mb-1">
            <div className="text-sm bold mr-2">First:</div>
            <InlineEdit
              text={user.firstName}
              onSetText={(val) => handleSetText('firstName', val)}
            />
          </div>
          <div className="flex mb-1">
            <div className="text-sm bold mr-2">Last:</div>
            <InlineEdit
              text={user.lastName}
              onSetText={(val) => handleSetText('lastName', val)}
            />
          </div>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex justify-between">
          <h3 className="text-lg font-bold mb-2">Location:</h3>
          <button
            onClick={handleLocationUpdate}
            className="bg-white text-black border-black border rounded-full py-1 px-4 shadow-lg self-start"
          >
            <Icon name="compass" />
          </button>
        </div>
        <div className="flex flex-col">
          <div className="flex mb-1">
            <div className="text-sm bold mr-2">Latitude:</div>
            <InlineEdit
              text={user.latitude}
              onSetText={(val) => handleSetText('latitude', val)}
            />
          </div>
          <div className="flex mb-1">
            <div className="text-sm bold mr-2">Longitude:</div>
            <InlineEdit
              text={user.longitude}
              onSetText={(val) => handleSetText('longitude', val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDataForm;
