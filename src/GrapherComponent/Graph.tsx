import { useContext } from 'react';
import styled from 'styled-components';
import { CtxDataType, DataType, IndicatorMetaDataType } from '../Types';
import Context from '../Context/Context';
import { HorizontalBarChart } from './HorizontalBarChart';
import { ScatterPlot } from './ScatterPlot';
import { BivariateMap } from './BivariateMap';
import { UnivariateMap } from './UnivariateMap';
import { BarChart } from './BarChart';

interface Props {
  data: DataType[];
  indicators: IndicatorMetaDataType[];
  fullWidth: boolean;
}

interface ElProps {
  fullWidth: boolean;
}

const El = styled.div<ElProps>`
  width: ${(props) => (props.fullWidth ? '100%' : '75%')};
  box-shadow: var(--shadow-right);
  flex-grow: 1;
  overflow: auto;
  @media (min-width: 961px) {
    height: calc(100vh - 12rem);
    min-height: calc(46.25rem + 4rem);
  }
  @media (max-width: 960px) {
    width: 100%;
  }
`;

export const Graph = (props: Props) => {
  const {
    data,
    indicators,
    fullWidth,
  } = props;
  const {
    graphType,
    yAxisIndicator,
    verticalBarLayout,
  } = useContext(Context) as CtxDataType;
  return (
    <El
      id='graph-node'
      fullWidth={fullWidth}
      className='undp-scrollbar'
    >
      {
        graphType === 'scatterPlot'
          ? yAxisIndicator
            ? (
              <ScatterPlot
                data={data}
                indicators={indicators}
              />
            ) : null
          : graphType === 'map'
            ? yAxisIndicator
              ? (
                <BivariateMap
                  data={data}
                  indicators={indicators}
                />
              )
              : (
                <UnivariateMap
                  data={data}
                  indicators={indicators}
                />
              )
            : verticalBarLayout ? (
              <HorizontalBarChart
                data={data}
                indicators={indicators}
              />
            )
              : (
                <BarChart
                  data={data}
                  indicators={indicators}
                />
              )

      }
    </El>
  );
};
