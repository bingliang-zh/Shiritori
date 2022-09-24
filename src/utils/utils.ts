// unicode
const hiragana =
    `ぁあぃいぅうぇえぉおかがきぎく\
ぐけげこごさざしじすずせぜそぞた\
だちぢっつづてでとどなにぬねのは\
ばぱひびぴふぶぷへべぺほぼぽまみ\
むめもゃやゅゆょよらりるれろゎわ\
ゐゑをんゔゕゖ ゙	゚	゛゜ゝゞゟ`;
const katakana =
    `ァアィイゥウェエォオカガキギク\
グケゲコゴサザシジスズセゼソゾタ\
ダチヂッツヅテデトドナニヌネノハ\
バパヒビピフブプヘベペホボポマミ\
ムメモャヤュユョヨラリルレロヮワ\
ヰヱヲンヴヵヶヷヸヹヺ・ーヽヾヿ`;

const isKana = (str: string): boolean => {
    if (str.length !== 1) {
        throw Error('isKana only support string with length 1');
    }
    return hiragana.includes(str) || katakana.includes(str);
}

export const isKanaOnly = (str: string): boolean => {
    for (let char of str) {
        if (!isKana(char)) {
            return false;
        }
    }
    return true;
}
