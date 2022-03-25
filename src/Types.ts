export interface CountryGroupDataType {
  'Alpha-2 code': string;
  'Alpha-3 code-1': string;
  'Country or Area': string;
  'Development classification': string;
  'Group 1': string;
  'Group 2': string;
  'Group 3': string;
  'LDC': boolean;
  'LLDC': boolean;
  'Latitude (average)': number;
  'Longitude (average)': number;
  'Numeric code': number;
  'SIDS': boolean;
  'Income group': string;
}

export interface IndicatorDataType {
  indicator: string;
  value?:number;
  labelExtra?: string | number;
}
export interface DataType extends CountryGroupDataType {
  data: IndicatorDataType[];
}

export interface IndicatorOptionsDataType {
  'Data source link': string;
  'Data source name': string;
  'Indicator': string;
  'Indicator Description': string;
  'Time period': string;
  'Year': string;
  'Categorical': boolean;
}

export interface IndicatorMetaDataType {
  Themes: string;
  Indicator: string;
  IndicatorDescription: string;
  DataKey: string;
  DataSourceName: string;
  DataSourceLink?: string;
  LabelSuffix?: string;
  LabelPrefix?: string;
  LabelFormat?: string;
  LabelExtra?:string;
  BinningRange5: number[];
  BinningRangeLarge: number[];
  Categories: number[];
  CategorizeByRanking?: boolean;
  IsCategorical?: boolean;
  IsDivergent?: boolean;
  ScatterPlot?: boolean;
  Map?: boolean;
  BarGraph?: boolean;
  Sizing?: boolean;
  Color?: boolean;
}

export interface IndicatorMetaDataWithYear extends IndicatorMetaDataType {
  years: number[];
}
export interface HoverRowDataType {
  title?: string;
  value?: string | number;
  prefix?: string;
  suffix?:string;
  type: 'x-axis' | 'y-axis' | 'color' | 'size';
  year?: number;
  color?: string;
  labelExtra?: string | number;
}

export interface HoverDataType {
  country: string;
  continent: string;
  rows: HoverRowDataType[];
  xPosition: number;
  yPosition: number;
}

export interface CtxDataType {
  graphType: 'scatterPlot' | 'map' | 'barGraph';
  selectedRegions: string[];
  selectedCountries: string[];
  selectedIncomeGroups: string[];
  selectedCountryGroup: 'All' | 'SIDS' | 'LLDC' | 'LDC';
  xAxisIndicator: string;
  yAxisIndicator?: string;
  colorIndicator: string;
  sizeIndicator?: string;
  showLabel: boolean;
  showSource: boolean;
  reverseOrder: boolean;
  verticalBarLayout: boolean;
  updateGraphType: (_d: 'scatterPlot' | 'map' | 'barGraph') => void;
  updateSelectedRegions: (_d: string[]) => void;
  updateSelectedCountries: (_d: string[]) => void;
  updateSelectedIncomeGroups: (_d: string[]) => void;
  updateSelectedCountryGroup: (_d: 'All' | 'SIDS' | 'LLDC' | 'LDC') => void;
  updateXAxisIndicator: (_d: string) => void;
  updateYAxisIndicator: (_d?: string) => void;
  updateColorIndicator: (_d?: string) => void;
  updateSizeIndicator: (_d?: string) => void;
  updateShowSource: (_d: boolean) => void;
  updateShowLabel: (_d: boolean) => void;
  updateReverseOrder: (_d: boolean) => void;
  updateBarLayout: (_d: boolean) => void;
}

export interface LastUpdatedDataType {
  Source: string;
  Date: string;
}
