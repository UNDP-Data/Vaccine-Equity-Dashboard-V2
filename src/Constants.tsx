export const CONTINENTS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

export const MAX_TEXT_LENGTH = 100;

export const TRUNCATE_MAX_TEXT_LENGTH = 125;

export const EMBED_LINK_ROOT = 'https://data.undp.org/vaccine-equity-visualization/';

export const PARENT_LINK_ROOT = 'https://data.undp.org/vaccine-equity/explore-data/';

export const DEFAULT_VALUES = {
  firstMetric: 'Secured and/or Expected Vaccine Supply in total courses (% of population)',
  secondMetric: 'Cost of vaccinating 40% of population as a percent of current health expenditure',
  colorMetric: 'Continents',
};

export const INCOME_GROUPS = ['Low income', 'Lower middle income', 'Upper middle income', 'High income'];

export const HDI_LEVELS = ['Low', 'Medium', 'High', 'Very High'];

export const COLOR_SCALES = {
  Null: '#F1F1F1',
  Linear: {
    RedColor4: [
      'rgb(230, 168, 58)',
      'rgb(204, 114, 47)',
      'rgb(170, 63, 43)',
      'rgb(128, 0, 38)',
    ],
    RedColor5: [
      'rgb(244, 225, 83)',
      'rgb(230, 168, 58)',
      'rgb(204, 114, 47)',
      'rgb(170, 63, 43)',
      'rgb(128, 0, 38)',
    ],
    RedColor6: [
      'rgb(244, 225, 83)',
      'rgb(233, 180, 61)',
      'rgb(216, 136, 50)',
      'rgb(192, 93, 46)',
      'rgb(162, 52, 42)',
      'rgb(128, 0, 38)',
    ],
    RedColor7: [
      'rgb(244, 225, 83)',
      'rgb(236, 187, 64)',
      'rgb(222, 150, 53)',
      'rgb(204, 114, 47)',
      'rgb(182, 80, 45)',
      'rgb(157, 45, 42)',
      'rgb(128, 0, 38)',
    ],
    RedColor8: [
      'rgb(244, 225, 83)',
      'rgb(237, 192, 66)',
      'rgb(227, 160, 56)',
      'rgb(213, 129, 49)',
      'rgb(196, 99, 46)',
      'rgb(175, 70, 44)',
      'rgb(153, 40, 41)',
      'rgb(128, 0, 38)',
    ],
    RedColor9: [
      'rgb(244, 225, 83)',
      'rgb(238, 196, 68)',
      'rgb(230, 168, 58)',
      'rgb(218, 141, 51)',
      'rgb(204, 114, 47)',
      'rgb(188, 88, 45)',
      'rgb(170, 63, 43)',
      'rgb(150, 36, 41)',
      'rgb(128, 0, 38)',
    ],
    RedColor10: [
      'rgb(244, 225, 83)',
      'rgb(239, 200, 69)',
      'rgb(232, 175, 60)',
      'rgb(222, 150, 53)',
      'rgb(211, 126, 49)',
      'rgb(198, 103, 46)',
      'rgb(182, 80, 45)',
      'rgb(166, 57, 43)',
      'rgb(147, 33, 41)',
      'rgb(128, 0, 38)',
    ],
    GreenColor4: [
      'rgb(179, 211, 92)',
      'rgb(116, 171, 79)',
      'rgb(61, 130, 65)',
      'rgb(0, 90, 50)',
    ],
    GreenColor5: [
      'rgb(250, 250, 110)',
      'rgb(179, 211, 92)',
      'rgb(116, 171, 79)',
      'rgb(61, 130, 65)',
      'rgb(0, 90, 50)',
    ],
    GreenColor6: [
      'rgb(250, 250, 110)',
      'rgb(192, 219, 95)',
      'rgb(140, 187, 84)',
      'rgb(93, 155, 73)',
      'rgb(50, 122, 62)',
      'rgb(0, 90, 50)',
    ],
    GreenColor7: [
      'rgb(250, 250, 110)',
      'rgb(202, 224, 98)',
      'rgb(157, 198, 87)',
      'rgb(116, 171, 79)',
      'rgb(78, 144, 70)',
      'rgb(43, 117, 61)',
      'rgb(0, 90, 50)',
    ],
    GreenColor8: [
      'rgb(250, 250, 110)',
      'rgb(208, 228, 99)',
      'rgb(169, 206, 90)',
      'rgb(133, 183, 82)',
      'rgb(100, 159, 75)',
      'rgb(68, 136, 67)',
      'rgb(38, 113, 59)',
      'rgb(0, 90, 50)',
    ],
    GreenColor9: [
      'rgb(250, 250, 110)',
      'rgb(213, 231, 100)',
      'rgb(179, 211, 92)',
      'rgb(146, 191, 85)',
      'rgb(116, 171, 79)',
      'rgb(88, 151, 72)',
      'rgb(61, 130, 65)',
      'rgb(34, 110, 58)',
      'rgb(0, 90, 50)',

    ],
    GreenColor10: [
      'rgb(250, 250, 110)',
      'rgb(217, 233, 101)',
      'rgb(186, 216, 94)',
      'rgb(157, 198, 87)',
      'rgb(129, 180, 81)',
      'rgb(103, 162, 76)',
      'rgb(78, 144, 70)',
      'rgb(55, 126, 64)',
      'rgb(31, 108, 57)',
      'rgb(0, 90, 50)',
    ],
  },
  Divergent: {
    Color4: [
      '#d7191c',
      '#fdae61',
      '#abdda4',
      '#2b83ba',
    ],
    Color5: [
      '#d7191c',
      '#fdae61',
      '#ffffbf',
      '#abdda4',
      '#2b83ba',
    ],
    Color6: [
      '#d53e4f',
      '#fc8d59',
      '#fee08b',
      '#e6f598',
      '#99d594',
      '#3288bd',
    ],
    Color7: [
      '#d53e4f',
      '#fc8d59',
      '#fee08b',
      '#ffffbf',
      '#e6f598',
      '#99d594',
      '#3288bd',
    ],
    Color8: [
      '#d53e4f',
      '#f46d43',
      '#fdae61',
      '#fee08b',
      '#e6f598',
      '#abdda4',
      '#66c2a5',
      '#3288bd',
    ],
    Color9: [
      '#d53e4f',
      '#f46d43',
      '#fdae61',
      '#fee08b',
      '#ffffbf',
      '#e6f598',
      '#abdda4',
      '#66c2a5',
      '#3288bd',
    ],
    Color10: [
      '#9e0142',
      '#d53e4f',
      '#f46d43',
      '#fdae61',
      '#fee08b',
      '#e6f598',
      '#abdda4',
      '#66c2a5',
      '#3288bd',
      '#5e4fa2',
    ],
    Color11: [
      '#9e0142',
      '#d53e4f',
      '#f46d43',
      '#fdae61',
      '#fee08b',
      '#ffffbf',
      '#e6f598',
      '#abdda4',
      '#66c2a5',
      '#3288bd',
      '#5e4fa2',
    ],
  },
  Categorical: [
    '#377eb8',
    '#4daf4a',
    '#984ea3',
    '#ff7f00',
    '#a65628',
    '#e41a1c',
    '#f781bf',
    '#ffff33',
  ],
  Bivariate: [
    ['#f1f1f1', '#BAE7F6', '#7FDCF9', '#41D0FC', '#0BC6FF'],
    ['#F6C5D4', '#BFBEDD', '#88B8E5', '#57B2ED', '#21ABF5'],
    ['#F99FBA', '#C89BC6', '#9697D3', '#6494DF', '#3690EB'],
    ['#F782A5', '#D180B3', '#9F7DC5', '#727AD4', '#4978E3'],
    ['#F4618D', '#D2619F', '#A961B3', '#8061C8', '#5C61DA'],
  ],
};
