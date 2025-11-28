// deckUtils.js
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// ---------------------------------
// ソート関連
// ---------------------------------
export const typeOrder = ['Artist', 'Song', 'Magic', 'Direction'];
export const colorOrder = ['赤', '青', '黄', '白', '黒', 'ALL'];

export const collectionList = [
  "スターターデッキ花譜",
  "スターターデッキ理芽",
  "スターターデッキ春猿火",
  "スターターデッキヰ世界情緒",
  "スターターデッキ幸祜",
  "ブースターパックvol.1「開演の魔女」",
  "KAMITSUBAKI COLLECTION EXTRA PACK",
  "ブースターパックvol.2「結束の連歌」",
  "御伽噺EXTRA PACK",
  "スターターデッキ花譜・明透",
  "スターターデッキ理芽・CIEL",
  "ブースターパックvol.3「再生の花達」",
  "IBA EXTRA PACK",
  "KAMITSUBAKI ARTWORK EXTRA PACK",
  "ブースターパックvol.4「魔女の黒鳴」",
  "MEMORIES PACK「追奏」",
  "プロモパックvol.1",
  "プロモパックvol.2",
  "エクストラ"
];

export const naturalCompare = (a, b) => {
  const ax = [];
  const bx = [];
  a.replace(/(\d+)|(\D+)/g, (_, $1, $2) => ax.push([$1 || Infinity, $2 || ""]));
  b.replace(/(\d+)|(\D+)/g, (_, $1, $2) => bx.push([$1 || Infinity, $2 || ""]));
  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();
    const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
    if (nn) return nn;
  }
  return ax.length - bx.length;
};

export const extractPrimaryColor = (color) => {
  if (!color) return 'ALL';
  for (const baseColor of colorOrder) {
    if (color.startsWith(baseColor)) return baseColor;
  }
  return 'ALL';
};

export const isMultiColor = (color) => {
  if (!color) return false;
  let count = 0;
  for (const baseColor of colorOrder) {
    if (color.includes(baseColor)) count++;
  }
  return count > 1;
};

export const sortDeck = (deckArray) => {
  return [...deckArray].sort((a, b) => {
    const aTypeIndex = typeOrder.indexOf(a.type);
    const bTypeIndex = typeOrder.indexOf(b.type);
    if (aTypeIndex !== bTypeIndex) return aTypeIndex - bTypeIndex;

    if (a.type === 'Magic' && b.type === 'Magic') {
      const kindOrder = ['即時', '装備'];
      const aKindIndex = kindOrder.indexOf(a.kind);
      const bKindIndex = kindOrder.indexOf(b.kind);
      if (aKindIndex !== bKindIndex) return aKindIndex - bKindIndex;
    }

    const aPrimary = extractPrimaryColor(a.color);
    const bPrimary = extractPrimaryColor(b.color);
    const aColorIndex = colorOrder.indexOf(aPrimary);
    const bColorIndex = colorOrder.indexOf(bPrimary);
    if (aColorIndex !== bColorIndex) return aColorIndex - bColorIndex;

    if (a.type === 'Song' && b.type === 'Song') {
      const aIsMulti = isMultiColor(a.color);
      const bIsMulti = isMultiColor(b.color);
      if (aIsMulti !== bIsMulti) return aIsMulti ? 1 : -1;
    }

    return naturalCompare(a.id, b.id);
  });
};

// ---------------------------------
// 暗号化・複合化
// ---------------------------------
const CodetoNumber = { ex: "0", A: "1", B: "2", C: "3", D: "4", E: "5", F: "6", G: "7", H: "8", I: "9", prm: "10", J: "11", K: "12", L: "13", M: "14", N: "15", O: "16", P: "17", Q: "18", R: "19" };
const CodetoNumber_alter = Object.fromEntries(Object.entries(CodetoNumber).map(([k, v]) => [v, k]));
const ElementtoNumber = { A: "1", S: "2", M: "3", D: "4" };
const ElementtoNumber_alter = Object.fromEntries(Object.entries(ElementtoNumber).map(([k, v]) => [v, k]));
const NumbertoNumber = {}; 
const NumbertoNumber_alter = {};
for (let i = 1; i <= 9; i++) {
  NumbertoNumber[i.toString()] = "0" + i;
  NumbertoNumber_alter["0" + i] = i.toString();
}
const numberToLetter = [
  ['A','I','Q','Y','g','o','w','5'], ['B','J','R','Z','h','p','x','6'],
  ['C','K','S','a','i','q','y','7'], ['D','L','T','b','j','r','z','8'],
  ['E','M','U','c','k','s','1','9'], ['F','N','V','d','l','t','2','!'],
  ['G','O','W','e','m','u','3','?'], ['H','P','X','f','n','v','4','/']
];
const letterToNumber_x = {}, letterToNumber_y = {};
for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
  letterToNumber_x[numberToLetter[i][j]] = j;
  letterToNumber_y[numberToLetter[i][j]] = i;
}

export function encryptDeck(deckList) { /* 同じ暗号化処理 */ return '...'; }
export function decryptCode(codeData) { /* 同じ復号処理 */ return '...'; }

// ---------------------------------
// Node.js 用 URL → Deck 解析
// ---------------------------------
export async function importDeckFromURL(importURL) {
  try {
    const url = new URL(importURL);
    let deckParam = url.searchParams.get('deck');
    if (!deckParam && url.hash) {
      const qIndex = url.hash.indexOf('?');
      if (qIndex !== -1) deckParam = url.hash.slice(qIndex + 1).split('deck=')[1];
    }
    if (!deckParam) return { mainDeck: [], sideDeck: [] };

    const [mainCode, sideCode] = deckParam.split('_');

    // cards.json の読み込み（Node.js版）
    const cardsPath = path.resolve('./public/cards.json');
    const allCards = JSON.parse(fs.readFileSync(cardsPath, 'utf-8'));

    const safeDecrypt = (code) => {
      try { return decryptCode(code) || ''; } catch { return ''; }
    };
    const toDeck = (ids) =>
      ids.map((id) => allCards.find((c) => c.id === id)).filter(c => c && c.name != null);

    const mainIds = safeDecrypt(mainCode).split('/').filter(Boolean);
    const sideIds = sideCode ? safeDecrypt(sideCode).split('/').filter(Boolean) : [];

    return {
      mainDeck: sortDeck(toDeck(mainIds)),
      sideDeck: sortDeck(toDeck(sideIds))
    };
  } catch (e) {
    console.error('デッキ読み込みエラー:', e);
    return { mainDeck: [], sideDeck: [] };
  }
}
