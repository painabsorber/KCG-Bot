// generateDeckImage.js
import { createCanvas, loadImage } from 'canvas';
import { sortDeck } from './deckUtils.js';

export async function generateDeckImageWithSideDeck(mainDeck, sideDeck = [], deckTitle = 'Deck') {
  const sortedMain = sortDeck(mainDeck);
  const sortedSide = sortDeck(sideDeck);

  let totalUniqueCount = sortedMain.length + sortedSide.length;
  let backgroundLevel = 1;
  if (totalUniqueCount <= 10) backgroundLevel = 1;
  else if (totalUniqueCount <= 20) backgroundLevel = 2;
  else if (totalUniqueCount <= 30) backgroundLevel = 3;
  else if (totalUniqueCount <= 40) backgroundLevel = 4;
  else if (totalUniqueCount <= 50) backgroundLevel = 5;
  else backgroundLevel = 6;

  const background = await loadImage(`./public/images/deck/Deck-${backgroundLevel}.png`);

  const canvas = createCanvas(background.width, background.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(background, 0, 0);
  ctx.fillStyle = 'rgb(247, 249, 251)';
  ctx.font = 'bold 120px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`「${deckTitle}」`, canvas.width / 2, 290);

  const cardWidth = 345, cardHeight = 481, cardsPerRow = 10;
  const offsetX = 364, offsetY = 395, gapX = 381, gapY = 606;

  const mainCardCount = {};
  for (const card of mainDeck) mainCardCount[card.id] = (mainCardCount[card.id] || 0) + 1;
  const sideCardCount = {};
  for (const card of sideDeck) sideCardCount[card.id] = (sideCardCount[card.id] || 0) + 1;

  for (let i = 0; i < sortedMain.length; i++) {
    const card = sortedMain[i];
    const image = await loadImage(`./public/images/${card.id}.webp`);
    const col = i % cardsPerRow, row = Math.floor(i / cardsPerRow);
    const x = offsetX + col * gapX, y = offsetY + row * gapY;
    ctx.drawImage(image, x, y, cardWidth, cardHeight);
    ctx.fillStyle = '#000';
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(mainCardCount[card.id], x + cardWidth / 2, y + cardHeight + 70);
  }

  const mainRows = Math.ceil(sortedMain.length / cardsPerRow);
  for (let i = 0; i < sortedSide.length; i++) {
    const card = sortedSide[i];
    const image = await loadImage(`./public/images/${card.id}.webp`);
    const col = i % cardsPerRow, row = mainRows + Math.floor(i / cardsPerRow);
    const x = offsetX + col * gapX, y = offsetY + row * gapY;

    ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)';
    ctx.lineWidth = 10;
    ctx.strokeRect(x - 5, y - 5, cardWidth + 10, cardHeight + 10);

    ctx.drawImage(image, x, y, cardWidth, cardHeight);
    ctx.fillStyle = '#000';
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(sideCardCount[card.id], x + cardWidth / 2, y + cardHeight + 70);
  }

  return canvas.toBuffer('image/png');
}
