export const CONTINENTS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

export const MAX_TEXT_LENGTH = 100;

export const TRUNCATE_MAX_TEXT_LENGTH = 125;

export const EMBED_LINK_ROOT = 'https://undp-vaccine-equity-viz.netlify.app/';

export const PARENT_LINK_ROOT = 'https://data.undp.org/vaccine-equity/explore-data/';

export const DEFAULT_VALUES = {
  firstMetric: 'Secured and/or Expected Vaccine Supply in total doses (% of population)',
  secondMetric: 'Cost of vaccinating 40% of population as a percent of current health expenditure',
  colorMetric: 'Continents',
};

export const INCOME_GROUPS = ['Low income', 'Lower middle income', 'Upper middle income', 'High income'];

export const HDI_LEVELS = ['Low', 'Medium', 'High', 'Very High'];

export const LABEL_EXTRA = [
  {
    forLabel: 'h7_vaccinationpolicy',
    labelExtra: 'h7_name',
  },
  {
    forLabel: 'v3_vaccinefinancialsupportsummar',
    labelExtra: 'v3_name',
  },
  {
    forLabel: 'informcovid19risk',
    labelExtra: 'covid19riskclass',
  },
  {
    forLabel: 'numberofdayseelapsedfromfirstvaccine',
    labelExtra: 'first_vaccine_date',
  },
];
