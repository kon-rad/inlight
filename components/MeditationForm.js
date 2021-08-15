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
  fileUrl,
  meditationData,
  onMeditationDataChange,
}) => {
  const [desc, setDesc] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [useGenerated, setUseGenerated] = useState(true);
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    if (fileUrl) {
      setUseGenerated(false);
    }
  }, [fileUrl]);
  const handleSetText = (key, val) => {
    const newUser = {
      ...user,
      [key]: val,
    };
    setUser(newUser);
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
    onMeditationDataChange('avatarBase64', newAvatar.base64);
  }, []);
  const renderImage = () => {
    if (fileUrl) {
      return <img className="rounded mt-4" width="350" src={fileUrl} />;
    }
    return useGenerated && avatarImage;
  };
  const handelUseGenerated = (event) => {
    if (!event.target.checked) {
      setUseGenerated(false);
    } else {
      onImageUpload(null);
      setUseGenerated(true);
    }
  };
  return (
    <div className="mt-2">
      <div className="mb-2">
        <h3 className="text-lg font-bold mb-2">Meditation:</h3>
        <div className="flex flex-col">
          <div className="flex mb-1">
            <div className="text-sm bold mr-2">Duration:</div>
            <div className="text-sm">{meditationData.duration}</div>
          </div>
          <div className="flex mb-1">
            <div className="text-sm bold mr-2">Start Time Stamp:</div>
            <div className="text-xs">
              {formatDate(meditationData.startTimeStamp)}
            </div>
          </div>
          <div className="flex mb-1">
            <div className="text-sm bold mr-2">End Time Stamp:</div>
            <div className="text-xs">
              {formatDate(meditationData.endTimeStamp)}
            </div>
          </div>
          <div className="flex mb-1 flex-col">
            <div className="text-sm bold mr-2">Description:</div>
            <textarea
              value={meditationData.description}
              onChange={(e) =>
                onMeditationDataChange('description', e.target.value)
              }
              className="MeditationForm__description rounded border mb-2 p-2 text-sm"
              placeholder="Any observations or notes?"
            />
          </div>
          <div className="flex mb-1">
            <div className="text-sm bold mr-2">Price (ETH):</div>
            <InlineEdit
              text={meditationData.price}
              onSetText={(val) => onMeditationDataChange('price', val)}
            />
          </div>
          <div className="flex flex-col mb-1">
            <div className="flex justify-between mb-2">
              <div className="flex flex-col overflow-hidden">
                <div className="text-sm bold mr-2">Image:</div>
                <div className="text-xs text-gray-400 ">
                  It can be an image of your meditation space or anything you
                  like
                </div>
                <input
                  type="file"
                  name="Asset"
                  className="mr-2"
                  onChange={onImageUpload}
                />
                <label className="mt-2 ">
                  <input
                    type="checkbox"
                    name="useGenerated"
                    onChange={handelUseGenerated}
                    className="mr-2"
                    checked={useGenerated}
                  />
                  use generated image
                </label>
              </div>
            </div>
            {renderImage()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationForm;
