import React, { useState, useEffect, useRef, useCallback } from 'react';
import useKeypress from '../hooks/useKeypress';
import useOnClickOutside from '../hooks/useOnClickOutside';
import DOMPurify from 'dompurify';

function InlineEdit(props) {
  const [isInputActive, setIsInputActive] = useState(false);
  const [inputValue, setInputValue] = useState(props.text);

  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const inputRef = useRef(null);

  const enter = useKeypress('Enter');
  const esc = useKeypress('Escape');

  const { onSetText } = props;

  // check to see if the user clicked outside of this component
  useOnClickOutside(wrapperRef, () => {
    if (isInputActive) {
      onSetText(inputValue);
      setIsInputActive(false);
    }
  });

  const onEnter = useCallback(() => {
    console.log('onenter: ', enter);
    if (enter) {
      onSetText(inputValue);
      setIsInputActive(false);
    }
  }, [enter, inputValue, onSetText]);

  const onEsc = useCallback(() => {
    console.log('onesc : ', esc, props.text);
    if (esc) {
      setInputValue(props.text);
      setIsInputActive(false);
    }
  }, [esc, props.text]);

  // focus the cursor in the input field on edit start
  useEffect(() => {
    if (isInputActive) {
      inputRef.current.focus();
    }
  }, [isInputActive]);

  useEffect(() => {
    console.log('effect isInputActive: ', isInputActive);

    if (isInputActive) {
      // if Enter is pressed, save the text and close the editor
      onEnter();
      // if Escape is pressed, revert the text and close the editor
      onEsc();
    }
  }, [onEnter, onEsc, isInputActive]); // watch the Enter and Escape key presses

  const handleInputChange = useCallback(
    (event) => {
      console.log('handleInputChange: ', event);
      // sanitize the input a little
      setInputValue(DOMPurify.sanitize(event.target.value));
    },
    [setInputValue]
  );

  const handleSpanClick = () => {
    if (props.text !== inputValue) {
      setInputValue(props.text);
    }
    setIsInputActive(true);
  };

  return (
    <span className="inline-text" ref={wrapperRef}>
      <span
        ref={textRef}
        onClick={handleSpanClick}
        className={`inline-text_copy inline-text_copy--${
          !isInputActive ? 'active' : 'hidden'
        } ${inputValue === '' ? 'inline-text_copy--empty' : ''}`}
      >
        {props.text}
      </span>
      <input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        className={`inline-text_input inline-text_input--${
          isInputActive ? 'active' : 'hidden'
        }`}
      />
    </span>
  );
}

export default InlineEdit;
