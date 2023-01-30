/* eslint-disable jsx-a11y/iframe-has-title */
import { useState, useEffect, useReducer } from 'react';
import { json, csv } from 'd3-request';
import uniqBy from 'lodash.uniqby';
import { queue } from 'd3-queue';
import styled from 'styled-components';
import {
  DataType, IndicatorMetaDataType, LastUpdatedDataType,
} from './Types';
import { GrapherComponent } from './GrapherComponent';
import Reducer from './Context/Reducer';
import Context from './Context/Context';
import { DEFAULT_VALUES } from './Constants';

const VizAreaEl = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
  justify-content: center;
  height: 10rem;
`;

const App = () => {
  const [finalData, setFinalData] = useState<DataType[] | undefined>(undefined);
  const [indicatorsList, setIndicatorsList] = useState<IndicatorMetaDataType[] | undefined>(undefined);
  const [regionList, setRegionList] = useState<string[] | undefined>(undefined);
  const [countryList, setCountryList] = useState<string[] | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<LastUpdatedDataType[] | undefined>(undefined);
  const queryParams = new URLSearchParams(window.location.search);
  const initialState = {
    graphType: queryParams.get('graphType') || 'map',
    selectedRegions: queryParams.get('regions')?.split('~') || [],
    selectedCountries: queryParams.get('countries')?.split('~') || [],
    selectedIncomeGroups: queryParams.get('incomeGroups')?.split('~') || [],
    selectedCountryGroup: queryParams.get('countryGroup') || 'All',
    xAxisIndicator: queryParams.get('firstMetric') || DEFAULT_VALUES.firstMetric,
    yAxisIndicator: queryParams.get('secondMetric') || DEFAULT_VALUES.secondMetric,
    colorIndicator: queryParams.get('colorMetric') || DEFAULT_VALUES.colorMetric,
    sizeIndicator: queryParams.get('sizeMetric') || undefined,
    showLabel: queryParams.get('showLabel') === 'true',
    showSource: false,
    reverseOrder: queryParams.get('reverseOrder') === 'true',
    verticalBarLayout: queryParams.get('verticalBarLayout') !== 'false',
  };

  const [state, dispatch] = useReducer(Reducer, initialState);

  const updateGraphType = (graphType: 'scatterPlot' | 'map' | 'barGraph' | 'trendLine') => {
    dispatch({
      type: 'UPDATE_GRAPH_TYPE',
      payload: graphType,
    });
  };

  const updateReverseOrder = (reverseOrder: boolean) => {
    dispatch({
      type: 'UPDATE_REVERSE_ORDER',
      payload: reverseOrder,
    });
  };

  const updateSelectedRegions = (selectedRegions: string[]) => {
    dispatch({
      type: 'UPDATE_SELECTED_REGIONS',
      payload: selectedRegions,
    });
  };

  const updateSelectedCountries = (selectedCountries: string[]) => {
    dispatch({
      type: 'UPDATE_SELECTED_COUNTRIES',
      payload: selectedCountries,
    });
  };

  const updateSelectedCountryGroup = (selectedCountryGroup: 'All' | 'SIDS' | 'LLDC' | 'LDC') => {
    dispatch({
      type: 'UPDATE_SELECTED_COUNTRY_GROUP',
      payload: selectedCountryGroup,
    });
  };

  const updateXAxisIndicator = (xAxisIndicator: string) => {
    dispatch({
      type: 'UPDATE_X_AXIS_INDICATOR',
      payload: xAxisIndicator,
    });
  };

  const updateYAxisIndicator = (yAxisIndicator?: string) => {
    dispatch({
      type: 'UPDATE_Y_AXIS_INDICATOR',
      payload: yAxisIndicator,
    });
  };

  const updateColorIndicator = (colorIndicator?: string) => {
    dispatch({
      type: 'UPDATE_COLOR_INDICATOR',
      payload: colorIndicator,
    });
  };

  const updateSizeIndicator = (sizeIndicator?: string) => {
    dispatch({
      type: 'UPDATE_SIZE_INDICATOR',
      payload: sizeIndicator,
    });
  };

  const updateSelectedIncomeGroups = (selectedIncomeGroups?: string) => {
    dispatch({
      type: 'UPDATE_SELECTED_INCOME_GROUPS',
      payload: selectedIncomeGroups,
    });
  };

  const updateShowMostRecentData = (selectedIncomeGroups: boolean) => {
    dispatch({
      type: 'UPDATE_SHOW_MOST_RECENT_DATA',
      payload: selectedIncomeGroups,
    });
  };

  const updateShowLabel = (showLabel: boolean) => {
    dispatch({
      type: 'UPDATE_SHOW_LABEL',
      payload: showLabel,
    });
  };

  const updateShowSource = (showSource: boolean) => {
    dispatch({
      type: 'UPDATE_SHOW_SOURCE',
      payload: showSource,
    });
  };

  const updateBarLayout = (varticalBarLayout: boolean) => {
    dispatch({
      type: 'UPDATE_BAR_LAYOUT',
      payload: varticalBarLayout,
    });
  };

  useEffect(() => {
    queue()
      .defer(json, 'https://raw.githubusercontent.com/UNDP-Data/Vaccine-Equity-Data-Repo/main/output_minified.json')
      .defer(json, 'https://raw.githubusercontent.com/UNDP-Data/Vaccine-Equity-Dashboard-Indicator-Metadata/for-redesign/indicatorMetaData.json')
      .defer(csv, 'https://raw.githubusercontent.com/UNDP-Data/Vaccine-Equity-Dashboard-Indicator-Metadata/main/last-updated.csv')
      .await((err: any, data: DataType[], indicatorMetaData: IndicatorMetaDataType[], lastUpdate: LastUpdatedDataType[]) => {
        if (err) throw err;
        setFinalData(data.filter((d) => d['Alpha-3 code'] !== 'ATA'));
        setCountryList(data.map((d) => d['Country or Area']));
        setRegionList(uniqBy(data, (d) => d['Group 2']).map((d) => d['Group 2']));
        setIndicatorsList(indicatorMetaData);
        setLastUpdated(lastUpdate);
      });
  }, []);
  return (
    <>
      {
        indicatorsList && finalData && regionList && countryList && lastUpdated
          ? (
            <div className='undp-container'>
              <Context.Provider
                value={{
                  ...state,
                  updateGraphType,
                  updateSelectedRegions,
                  updateSelectedCountries,
                  updateSelectedCountryGroup,
                  updateXAxisIndicator,
                  updateYAxisIndicator,
                  updateColorIndicator,
                  updateSizeIndicator,
                  updateSelectedIncomeGroups,
                  updateShowMostRecentData,
                  updateShowLabel,
                  updateShowSource,
                  updateReverseOrder,
                  updateBarLayout,
                }}
              >
                <GrapherComponent
                  data={finalData}
                  indicators={indicatorsList}
                  regions={regionList}
                  countries={countryList}
                  lastUpdated={lastUpdated}
                />
              </Context.Provider>
            </div>
          )
          : (
            <VizAreaEl className='undp-container'>
              <div className='undp-loader' />
            </VizAreaEl>
          )
      }
    </>
  );
};

export default App;
