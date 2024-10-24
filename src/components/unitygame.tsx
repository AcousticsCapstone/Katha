import React, { useEffect, useRef } from 'react';

interface UnityGameProps {
  width: string;
  height: string;
}

const UnityGame: React.FC<UnityGameProps> = ({ width, height }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // You can add any initialization logic here if needed
  }, []);

  return (
    <iframe
    ref={iframeRef}
    src="/Katha/index.html"
    width={width}
    height={height}
    style={{ border: 'none' }}
    title="Unity WebGL Game"
    />
  );
};

export default UnityGame;