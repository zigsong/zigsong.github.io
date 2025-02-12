import React, { createRef, useEffect } from 'react';

const Comment = () => {
  const containerRef = createRef();

  useEffect(() => {
    const utterances = document.createElement('script');
    const attributes = {
      src: 'https://utteranc.es/client.js',
      repo: 'zigsong/zigsong.github.io',
      'issue-term': 'pathname',
      label: 'comment',
      theme: 'preferred-color-scheme',
      crossOrigin: 'anonymous',
      async: 'true',
    };

    Object.entries(attributes).forEach(([key, value]) => {
      utterances.setAttribute(key, value);
    });

    containerRef.current.appendChild(utterances);
  }, [containerRef]);

  return <div id="comment" ref={containerRef} />;
};

export default Comment;
