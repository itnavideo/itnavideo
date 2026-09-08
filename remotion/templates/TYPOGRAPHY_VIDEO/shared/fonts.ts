import React from 'react';

export const CLOUDINARY_FONTS = {
  Cinzel: 'https://res.cloudinary.com/dhouh9idx/raw/upload/v1788458275/fonts/cinzel-bold.woff2',
  Inter: 'https://res.cloudinary.com/dhouh9idx/raw/upload/v1788458277/fonts/inter-bold.woff2',
  Montserrat: 'https://res.cloudinary.com/dhouh9idx/raw/upload/v1788458277/fonts/montserrat-bold.woff2',
  'Playfair Display': 'https://res.cloudinary.com/dhouh9idx/raw/upload/v1788458278/fonts/playfair-display-bold.woff2',
  'Plus Jakarta Sans': 'https://res.cloudinary.com/dhouh9idx/raw/upload/v1788458279/fonts/plus-jakarta-sans-bold.woff2',
  'Bodoni Moda': 'https://res.cloudinary.com/dhouh9idx/raw/upload/v1788458280/fonts/bodoni-moda-bold.woff2',
  Syne: 'https://res.cloudinary.com/dhouh9idx/raw/upload/v1788458281/fonts/syne-bold.woff2',
  'Bebas Neue': 'https://res.cloudinary.com/dhouh9idx/raw/upload/v1788458281/fonts/bebas-neue-bold.woff2',
  Outfit: 'https://res.cloudinary.com/dhouh9idx/raw/upload/v1788458282/fonts/outfit-bold.woff2',
  Poppins: 'https://res.cloudinary.com/dhouh9idx/raw/upload/v1788458283/fonts/poppins-bold.woff2',
  Oswald: 'https://res.cloudinary.com/dhouh9idx/raw/upload/v1788458283/fonts/oswald-bold.woff2',
};

export const FONT_FACES_CSS = Object.entries(CLOUDINARY_FONTS).map(([name, url]) => `
@font-face {
  font-family: '${name}';
  src: url('${url}') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
`).join('\n');

export const FONTS = {
  inter: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  montserrat: '"Montserrat", sans-serif',
  playfair: '"Playfair Display", Georgia, serif',
  cinzel: '"Cinzel", "Times New Roman", serif',
  jakarta: '"Plus Jakarta Sans", sans-serif',
  bodoni: '"Bodoni Moda", Didot, serif',
  syne: '"Syne", sans-serif',
  bebas: '"Bebas Neue", Impact, sans-serif',
  outfit: '"Outfit", sans-serif',
  poppins: '"Poppins", sans-serif',
  oswald: '"Oswald", "Bebas Neue", Impact, sans-serif',
};

export const TypographyFontStyles: React.FC = () =>
  React.createElement('style', {
    dangerouslySetInnerHTML: {
      __html: FONT_FACES_CSS,
    },
  });
