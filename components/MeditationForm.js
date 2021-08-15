import React, { useState, useEffect } from 'react';
import InlineEdit from './InlineEdit';
import { useContext } from 'react';
import { UserContext } from './userContext';
import generateAvatar from '../utilities/generateAvatar';
import formatDate from '../utilities/formatDate';

const MeditationForm = ({
  duration,
  startTimeStamp,
  endTimeStamp,
  onImageUpload,
}) => {
  const [desc, setDesc] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const handleSetText = (key, val) => {
    const newUser = {
      ...user,
      [key]: val,
    };
    setUser(newUser);
  };
  const handleChangeDescription = (e) => {
    setDesc(e.target.value);
  };
  useEffect(() => {
    let newAvatar = generateAvatar({
      blocks: 6,
      width: 100,
    });
    const image = React.createElement('img', {
      src: newAvatar.base64,
      className: 'mb-2',
    });
    setAvatar(newAvatar);
    setAvatarImage(image);
  }, []);
  return (
    <div className="mt-2">
      <div className="mb-2">
        <h3 className="text-lg font-bold mb-2">Meditation:</h3>
        <div className="flex flex-col">
          <div className="flex mb-1">
            <div className="text-sm bold mr-2">Duration:</div>
            <div className="text-sm">{duration}</div>
          </div>
          <div className="flex mb-1">
            <div className="text-sm bold mr-2">Start Time Stamp:</div>
            <div className="text-xs">{formatDate(startTimeStamp)}</div>
          </div>
          <div className="flex mb-1">
            <div className="text-sm bold mr-2">End Time Stamp:</div>
            <div className="text-xs">{formatDate(endTimeStamp)}</div>
          </div>
          <div className="flex mb-1 flex-col">
            <div className="text-sm bold mr-2">Description:</div>
            <textarea
              value={desc}
              onChange={handleChangeDescription}
              className="MeditationForm__description rounded border mb-2 p-2 text-sm"
              placeholder="Any observations or notes?"
            />
          </div>
          <div className="flex flex-col mb-1">
            <div className="flex justify-between mb-2">
              <div className="flex flex-col">
                <div className="text-sm bold mr-2">Image:</div>
                <div className="text-xs text-gray-400 ">
                  It can be an image of your meditation space or anything you
                  like
                </div>
              </div>
              <button
                onClick={onImageUpload}
                className="bg-white text-black border-black border rounded-full py-1 px-4 shadow-lg self-start"
              >
                upload
              </button>
            </div>
            {avatarImage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationForm;
