import { useContext } from 'react';
import styled from 'styled-components';
import {
  CtxDataType, DataType, IndicatorMetaDataType, LastUpdatedDataType,
} from '../Types';
import Context from '../Context/Context';
import { DataSourceListItem } from '../Components/DataSourceListItem';

interface Props {
  indicators: IndicatorMetaDataType[];
  data: DataType[];
  lastUpdated: LastUpdatedDataType[];
}

const El = styled.div`
  width: 75%;
  flex-grow: 1;
  overflow: auto;
  @media (max-width: 960px) {
    width: 100%;
    height: auto;
    min-height: 0;
  }
`;

const HeaderEl = styled.div`
  padding: var(--spacing-07);
  background-color: var(--white);
  border-bottom: 1px solid var(--gray-400);
  position: sticky;
  top: 0;
`;

export const DataSources = (props: Props) => {
  const {
    indicators,
    data,
    lastUpdated,
  } = props;
  const {
    graphType,
    xAxisIndicator,
    yAxisIndicator,
    sizeIndicator,
    colorIndicator,
    updateShowSource,
  } = useContext(Context) as CtxDataType;
  const xIndicatorMetaData = indicators[indicators.findIndex((d) => d.Indicator === xAxisIndicator)];

  const yIndicatorMetaData = indicators[indicators.findIndex((d) => d.Indicator === yAxisIndicator)];

  const sizeIndicatorMetaData = indicators[indicators.findIndex((d) => d.Indicator === sizeIndicator)];

  const colorIndicatorMetaData = colorIndicator === 'Human Development Index' ? indicators[indicators.findIndex((d) => d.Indicator === 'Human development index (HDI)')] : indicators[indicators.findIndex((d) => d.Indicator === colorIndicator)];

  return (
    <El className='undp-scrollbar'>
      <HeaderEl className='flex-div flex-space-between flex-vert-align-center'>
        <h4 className='undp-typography margin-bottom-00'>
          Data Description
        </h4>
        <button className='undp-button button-primary' type='button' onClick={() => { updateShowSource(false); }}>Close</button>
      </HeaderEl>
      <DataSourceListItem
        indicatorData={xIndicatorMetaData}
        lastUpdated={lastUpdated}
        data={data}
      />
      {
        graphType !== 'barGraph' && yIndicatorMetaData ? (
          <>
            <hr className='undp-style' />
            <DataSourceListItem
              indicatorData={yIndicatorMetaData}
              lastUpdated={lastUpdated}
              data={data}
            />
          </>
        ) : null
      }
      {
        graphType !== 'map' && colorIndicatorMetaData ? (
          <>
            <hr className='undp-style' />
            <DataSourceListItem
              indicatorData={colorIndicatorMetaData}
              lastUpdated={lastUpdated}
              data={data}
            />
          </>
        ) : null
      }
      {
        (graphType === 'scatterPlot' || graphType === 'map') && sizeIndicatorMetaData ? (
          <>
            <hr className='undp-style' />
            <DataSourceListItem
              indicatorData={sizeIndicatorMetaData}
              lastUpdated={lastUpdated}
              data={data}
            />
          </>
        ) : null
      }
    </El>
  );
};
