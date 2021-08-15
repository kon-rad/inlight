import InlineEdit from './InlineEdit';
import { useContext } from 'react';
import { UserContext } from './userContext';
import Icon from './Icon';
import { useToasts } from 'react-toast-notifications';

const UserDataForm = () => {
  const { user, setUser } = useContext(UserContext);
  const { addToast } = useToasts();

  const handleSetText = (key, val) => {
    const newUser = {
      ...user,
      [key]: val,
    };
    setUser((user) => ({
      ...user,
      [key]: val,
    }));
    console.log('handleSetText change newUser: ', newUser);
  };
  const setLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log('Latitude is :', position.coords.latitude);
      console.log('Longitude is :', position.coords.longitude);
      console.log('position is :', position);
      setUser((user) => ({
        ...user,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    });
  };
  const handleLocationUpdate = () => {
    if ('geolocation' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then(function (result) {
          if (result.state === 'granted') {
            console.log(result.state);
            setLocation();
          } else if (result.state === 'prompt') {
            console.log(result.state);
          } else if (result.state === 'denied') {
            //If denied then you have to show instructions to enable location
            const content = (
              <div>
                Location permissions were denied.{' '}
                <a
                  target="_blank"
                  href="https://support.google.com/chrome/answer/142065?hl=en&co=GENIE.Platform%3DDesktop"
                >
                  click here
                </a>{' '}
                for instructions on how to enable this in your browser.
              </div>
            );
            addToast(content, {
              appearance: 'error',
              autoDismiss: false,
            });
          }
        });
    } else {
      console.log('Not Available');
    }
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
