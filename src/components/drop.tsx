/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/prop-types */

import { useAtom } from 'jotai';
import React, { useCallback, useState } from 'react';
import { placeholderAtom, submitValueAtom } from '../jotai';
import { useEscape, useMountMainHeight } from '../hooks';

export default function Drop() {
  // useEscape();

  const [dropReady, setDropReady] = useState(false);
  const [dropMessage, setDropMessage] = useState('');

  const [placeholder] = useAtom(placeholderAtom);
  const [, submit] = useAtom(submitValueAtom);

  const onDragEnter = useCallback((event) => {
    event.preventDefault();
    setDropReady(true);
    setDropMessage('Drop to submit');
  }, []);
  const onDragLeave = useCallback(
    (event) => {
      setDropReady(false);
      setDropMessage(placeholder);
    },
    [placeholder]
  );

  const onDrop = useCallback(
    (event) => {
      setDropReady(false);
      const files = Array.from(event?.dataTransfer?.files);
      if (files?.length > 0) {
        submit(files);
        return;
      }

      const data =
        event?.dataTransfer?.getData('URL') ||
        event?.dataTransfer?.getData('Text') ||
        null;
      if (data) {
        submit(data);
        return;
      }
      if (event.target.value) {
        submit(event.target.value);
        return;
      }

      setTimeout(() => {
        submit(event.target.value);
      }, 100);
    },
    [submit]
  );

  const containerRef = useMountMainHeight();

  return (
    <div ref={containerRef} className="h-full w-full">
      <div
        tabIndex={0}
        role="region"
        aria-label="droppable area"
        style={
          {
            WebkitAppRegion: 'drag',
            WebkitUserSelect: 'none',
          } as any
        }
        className={`
        w-full h-full
        drop-component
        flex flex-col justify-center items-center
        text-text-base  text-xl
        focus:outline-none outline-none
        ring-0 ring-opacity-0 focus:ring-0 focus:ring-opacity-0
        transition ease-in-out duration-500 ${
          dropReady ? `opacity-75 shadow-inner` : `opacity-25`
        }
      `}
        placeholder={placeholder}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
      >
        <h2 className="pointer-events-none mb-0">
          {dropMessage || placeholder}
        </h2>
      </div>
    </div>
  );
}
