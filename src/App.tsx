import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import N5Dictionary from './data/N5.json';
import N2Dictionary from './data/N2.json';
import { buildDictionary, DictionaryTree, Word } from './utils/buildDictionary';
import { isKanaOnly } from './utils/utils';

const DEFAULT_DIC_TAG = 'N5';

type DictionaryTag = 'N2' | 'N5'

function App() {
  const [dictionaryTag, setDictionaryTag] = useState<DictionaryTag>(DEFAULT_DIC_TAG);
  const [dictionaryTree, setDictionaryTree] = useState<DictionaryTree>();
  const [dictionary, setDictionary] = useState<Word[]>();
  const [usedWords, setUsedWords] = useState<Word[]>([]);

  useEffect(() => {
    switch (dictionaryTag) {
      case 'N2':
        setDictionaryTree(buildDictionary(N2Dictionary as Word[]));
        setDictionary(N2Dictionary as Word[]);
        break;
      case 'N5':
        setDictionaryTree(buildDictionary(N5Dictionary as Word[]))
        setDictionary(N5Dictionary as Word[]);
        break;
    }
  }, [dictionaryTag]);

  useEffect(() => {
    console.log(dictionaryTree)
  }, [dictionaryTree])

  const onDicChange = (e: any) => {
    setDictionaryTag(e.target.value);
  }

  const [input, setInput] = useState('');

  const onInputChange = (e: any) => {
    setInput(e.target.value);
  }

  const onInputKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      answer(input);
      setInput('');
    }
  }

  const getPossibleHeads = (str: string) => {
    // TODO: add more rules
    const end = str[str.length - 1];
    return [end];
  }

  const answer = (str: string) => {
    if (str === '') { return; }
    const kanaOnly = isKanaOnly(str);
    if (kanaOnly) {
      // find that word and remove it if it is in the dictionaryTree
      const fakeWord: Word = [-1, str, '', '', '']
      const matchedWord = dictionaryTree?.find(fakeWord, true);
      // add to used words
      setUsedWords(words => [...words, matchedWord || fakeWord])
      // get a random word with rules
      const reply = dictionaryTree?.getRandomWord(getPossibleHeads(str), true);
      if (!reply) {
        console.log('the computer is failed');
      } else {
        setUsedWords(words => [...words, reply])
      }
    } else {
      // try to find it in raw dictionary
      const matchedWord = dictionary?.find(word => {
        const kanji = word[2];
        return kanji === str;
      });
      if (!matchedWord) {
        console.log('the computer doesn\'t know this word, try input kana only');
      } else {
        dictionaryTree?.find(matchedWord, true);
        // add to used words
        setUsedWords(words => [...words, matchedWord]);
        // get a random word with rules
        const reply = dictionaryTree?.getRandomWord(getPossibleHeads(matchedWord[1]), true);
        if (!reply) {
          console.log('the computer is failed');
        } else {
          setUsedWords(words => [...words, reply])
        }
      }
    }
  }

  useEffect(() => {
    console.log(usedWords)
  }, [usedWords])

  return (
    <div style={{ padding: 20 }}>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Dictionary</InputLabel>

          <Select value={dictionaryTag} label="Dictionary" onChange={onDicChange}>
            <MenuItem value={'N2'}>N2</MenuItem>
            <MenuItem value={'N5'}>N5</MenuItem>
          </Select>

          <TextField id="standard-basic" label="Your input" variant="standard"
            value={input} onChange={onInputChange} onKeyDown={onInputKeyDown}
          />
        </FormControl>
      </Box>
    </div >
  );
}

export default App;
