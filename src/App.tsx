import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import N5Dictionary from './data/N5.json';
import N2Dictionary from './data/N2.json';
import { buildDictionary, DictionaryTree, Word } from './utils/buildDictionary';

const DEFAULT_DIC_TAG = 'N2';

type DictionaryTag = 'N2' | 'N5'

function App() {
  const [dictionaryTag, setDictionaryTag] = useState<DictionaryTag>(DEFAULT_DIC_TAG);
  const [dictionaryTree, setDictionaryTree] = useState<DictionaryTree>();


  useEffect(() => {
    switch (dictionaryTag) {
      case 'N2':
        setDictionaryTree(buildDictionary(N2Dictionary as Word[]))
        break;
      case 'N5':
        setDictionaryTree(buildDictionary(N5Dictionary as Word[]))
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

  const answer = (userInput: string) => {
    if (input === '') { return; }
    const end = userInput[userInput.length - 1];
    console.log(end);
    // TODO
  }

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
