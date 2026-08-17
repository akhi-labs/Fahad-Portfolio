import { Fragment } from 'react';

// inline-block so each word can take a transform; the trailing nbsp preserves
// spacing now that words are separate elements.
export function splitWords(text: string) {
  const words = text.split(' ');
  return words.map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span data-word style={{ display: 'inline-block' }}>
        {word}
      </span>
      {i < words.length - 1 ? ' ' : null}
    </Fragment>
  ));
}
