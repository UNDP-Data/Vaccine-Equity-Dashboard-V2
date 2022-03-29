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
  box-shadow: var(--shadow-right);
  height: 74rem;
  overflow: auto;
`;

const HeaderEl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  font-size: 2rem;
  font-weight: bold;
  background-color: var(--white);
  border-bottom: 1px solid var(--black-400);
  margin-bottom: 2rem;
  position: sticky;
  box-shadow: var(--shadow-bottom);
  top: 0;
`;

const HR = styled.hr`
  margin: 0 2rem 2rem 2rem;
  border: 1px solid var(--black-400);
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
    <El>
      <HeaderEl>
        <div>
          Data Description
        </div>
        <button className='primary' type='button' onClick={() => { updateShowSource(false); }}>Close</button>
      </HeaderEl>
      <DataSourceListItem
        indicatorData={xIndicatorMetaData}
        lastUpdated={lastUpdated}
        data={data}
      />
      {
        graphType !== 'barGraph' && yIndicatorMetaData ? (
          <>
            <HR />
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
            <HR />
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
            <HR />
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
