import { useContext } from 'react';

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
  } = useContext(Context) as CtxDataType;

  const xIndicatorMetaData = indicators[indicators.findIndex((d) => d.Indicator === xAxisIndicator)];

  const yIndicatorMetaData = indicators[indicators.findIndex((d) => d.Indicator === yAxisIndicator)];

  const sizeIndicatorMetaData = indicators[indicators.findIndex((d) => d.Indicator === sizeIndicator)];

  const colorIndicatorMetaData = colorIndicator === 'Human Development Index' ? indicators[indicators.findIndex((d) => d.Indicator === 'Human development index (HDI)')] : indicators[indicators.findIndex((d) => d.Indicator === colorIndicator)];

  return (
    <div className='undp-scrollbar'>
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
    </div>
  );
};
