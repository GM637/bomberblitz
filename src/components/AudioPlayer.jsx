import React, { useEffect, useState } from 'react';
import { useSound } from 'use-sound';

const AudioComponent = ({ url, loop = false, volume = 1.0 }) => {
  const [playedOnce, setPlayedOnce] = useState(false); // State to track if audio has played once

  // Load the audio file and obtain the play function from useSound
  const [play, { stop }] = useSound(url, {
    loop,
    volume,
  });

  // Function to handle document click and play the audio
  const handleDocumentClick = () => {
    if (!playedOnce) {
      setPlayedOnce(true);
      console.log('Audio is now playing!'); // Add console log to track audio start
    }
  };

  // Add click event listener when the component mounts
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick, { once: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick); // Remove the click event listener when the component unmounts
      stop(); // Clean up: stop the audio when the component unmounts
    };
  }, [play, stop]);

  // Play the audio when playedOnce changes to true
  useEffect(() => {
    if (playedOnce) {
      play();
    }
  }, [playedOnce, play]);

  return null; // You can replace this with an actual 3D model or other elements if needed
};

export default AudioComponent;
