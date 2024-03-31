"use client"
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface ReferenceLinkProps {
  text: string;
}

const ReferenceLink: React.FC<ReferenceLinkProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset copied state after 1.5 seconds
  };

  return (
    <div>
      <div className='p-2 bg-base-300 mb-2'>
        <p>{text}</p>
      </div>
      <CopyToClipboard text={text} onCopy={handleCopy}>
        <button>{copied ? 'Copied!' : 'Copy to Clipboard'}</button>
      </CopyToClipboard>
    </div>
  );
};

export default ReferenceLink;
