// Index, Kana, Kanji, Type, Definition/s
type Word = [number, string, string, string, string];
class DictionaryTree {
    words?: Set<Word>;
    subTrees?: Map<string, DictionaryTree>;

    public add(word: Word, remainString?: string) {
        // init remainString for recursion
        if (remainString === undefined) {
            remainString = word[1];
        }

        if (remainString === '') {
            // add to this node
            if (!this.words) {
                this.words = new Set();
            }
            this.words.add(word);
        } else {
            // add to subTree
            const nextKana = remainString[0];
            if (!this.subTrees) {
                this.subTrees = new Map();
            }
            const subTree = this.subTrees.get(nextKana) || new DictionaryTree;
            if (!this.subTrees.has(nextKana)) {
                this.subTrees.set(nextKana, subTree);
            }
            subTree.add(word, remainString.substring(1));
        }
    }
}

const isWordWeWant = (word: Word): boolean => {
    const types = word[3].split(',');
    return types.includes('n');

}

const buildDictionary = (words: Word[]): DictionaryTree => {
    const dic = new DictionaryTree();

    for (let word of words) {
        if (isWordWeWant(word)) {
            dic.add(word);
        }
    }

    return dic;
}

export type { Word, DictionaryTree }
export { buildDictionary };