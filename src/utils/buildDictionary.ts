// Index, Kana, Kanji, Type, Definition/s
type Word = [number, string, string, string, string];
class DictionaryTree {
    words?: Set<Word>;
    subTrees?: Map<string, DictionaryTree>;
    parent?: DictionaryTree;
    count: number = 0;

    public add(word: Word, remainString?: string) {
        // init remainString for recursion
        if (remainString === undefined) {
            remainString = word[1];
        }

        if (remainString === "") {
            // add to this node
            if (!this.words) {
                this.words = new Set();
            }
            this.words.add(word);
            // update tree count
            this.count++;
            let parent = this.parent;
            while (parent) {
                parent.count++;
                parent = parent.parent;
            }
        } else {
            // add to subTree
            const nextKana = remainString[0];
            if (!this.subTrees) {
                this.subTrees = new Map();
            }
            const subTree = this.subTrees.get(nextKana) || new DictionaryTree();
            if (!this.subTrees.has(nextKana)) {
                subTree.parent = this;
                this.subTrees.set(nextKana, subTree);
            }
            subTree.add(word, remainString.substring(1));
        }
    }

    private delete(word: Word) {
        if (this.words && this.words.has(word)) {
            this.words.delete(word);
            let current: DictionaryTree | undefined = this;
            while (current) {
                current.count--;
                const p: DictionaryTree | undefined = current.parent;
                if (current.count === 0 && p) {
                    p.subTrees?.forEach((tree, key) => {
                        if (tree === current) {
                            p.subTrees?.delete(key);
                        }
                    })
                }
                current = p;
            }
        }
    }

    public find(
        word: Word,
        removeThatWord: boolean = false,
        remainString?: string
    ): Word | undefined {
        const [, kana, kanji] = word;
        if (remainString === undefined) {
            remainString = kana;
        }
        if (remainString === "") {
            if (!this.words) {
                return undefined;
            }
            if (kanji !== "") {
                // find the one matches kanji
                for (let w of this.words.values()) {
                    const [, , wKanji] = w;
                    if (wKanji === kanji) {
                        if (removeThatWord) {
                            this.delete(w);
                        }
                        return w;
                    }
                }
            } else {
                // find the one matches kana
                for (let w of this.words.values()) {
                    const [, wKana] = w;
                    if (wKana === kana) {
                        if (removeThatWord) {
                            this.delete(w);
                        }
                        return w;
                    }
                }
            }
        } else {
            const head = remainString[0];
            if (!this.subTrees?.has(head)) {
                return undefined;
            } else {
                return this.subTrees.get(head)?.find(word, removeThatWord, remainString.substring(1));
            }
        }
    }

    public getRandomWord(
        heads?: string[],
        removeThatWord: boolean = false
    ): Word | undefined {
        // TODO: support more matching method
        if (heads) {
            const randomWords: Word[] = [];
            for (let head of heads) {
                const subTree = this.subTrees?.get(head);
                const randomWord = subTree?.getRandomWord(undefined, removeThatWord)
                if (randomWord) {
                    randomWords.push(randomWord);
                }
            }
            let random = Math.floor(Math.random() * randomWords.length);
            return randomWords[random];
        } else {
            let random = Math.floor(Math.random() * this.count);
            if (this.words && random < this.words.size) {
                const result = Array.from(this.words)[random];
                if (removeThatWord) {
                    this.delete(result);
                }
                return result;
            } else if (this.subTrees) {
                random -= this.words?.size || 0;
                for (let subTree of this.subTrees.values()) {
                    if (random >= subTree.count) {
                        random -= subTree.count;
                        continue;
                    } else {
                        return subTree.getRandomWord(undefined, removeThatWord);
                    }
                }
            }
        }
    }
}

const wordFilter = (word: Word): boolean => {
    // filter nouns
    // https://www.romajidesu.com/content/dictionary_code.html
    const [, kana, kanji, typeStr] = word;
    const types = typeStr.split(",");
    return (types.includes("n")
        || types.includes("adj-na")
        || types.includes("n-p")
        || types.includes("n-adv")
        || types.includes("adj-no")
        || types.includes("n-t")
        || types.includes("adj-f")
        ) && kana[kana.length - 1] !== 'ん';
};

const buildDictionary = (words: Word[]): DictionaryTree => {
    const dic = new DictionaryTree();

    for (let word of words.filter(wordFilter)) {
        dic.add(word);
    }

    return dic;
};

export type { Word, DictionaryTree };
export { buildDictionary };
