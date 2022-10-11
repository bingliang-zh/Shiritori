import { DictionaryTree, Word } from "./buildDictionary";

const getEndsOfKana = (kana: string) => {
    // TODO: more rules
    return [kana[kana.length - 1]];
}

enum UserInputType {
    Illegal,
    IllegalEndWithN,
    Used,
    Valid,
}

const checkUserInput = (
    newWord: Word,
    dictionaryTree: DictionaryTree,
    dictionary: Word[],
    usedWords: Word[],
    lastWord: Word,
) => {
    const kana = lastWord[1];
    const endsOfKana = getEndsOfKana(kana);
    const newHead = newWord[1][0];
    if (!endsOfKana.includes(newHead)) {
        return UserInputType.Illegal;
    }
    if (endsOfKana.length === 1 && endsOfKana[0] === 'ん') {
        return UserInputType.IllegalEndWithN;
    }
    let newWordIsUsedBefore = false;
    for (let usedWord of usedWords) {
        if (newWord[0] === -1) {
            // not in dictionary, kana only
            if (usedWord[0] === -1 && usedWord[1] === newWord[1]) {
                newWordIsUsedBefore = true;
                break;
            }
        } else {
            // new word is in dictionary, check id
            if (usedWord[0] === newWord[0]) {
                newWordIsUsedBefore = true;
                break;
            }
        }
    }
    if (newWordIsUsedBefore) {
        return UserInputType.Used;
    } else {
        return UserInputType.Valid;
    }
}

export const aiResponse = (
    dictionaryTree: DictionaryTree,
    lastWord: Word,
) => {
    const kana = lastWord[1];
    const endsOfKana = getEndsOfKana(kana);
    return dictionaryTree.getRandomWord(endsOfKana, true);
}

export {};
