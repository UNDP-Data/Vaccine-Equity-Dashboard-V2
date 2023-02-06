import { useContext, useState } from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import {
  CtxDataType, DataType, IndicatorMetaDataType, LastUpdatedDataType,
} from '../Types';
import {
  ScatterPlotIcon, BarGraphIcon, MapIcon, Logo,
} from '../Icons';
import Context from '../Context/Context';
import { Settings } from './Settings';
import { Graph } from './Graph';
import { DataSources } from './DataSources';
import { GetEmbedParams } from '../Components/GetEmbedParams';
import { CopyLinkWithParamButton } from '../Components/CopyLinkWithParamButton';

interface Props {
  data: DataType[];
  indicators: IndicatorMetaDataType[];
  regions: string[];
  countries: string[];
  lastUpdated: LastUpdatedDataType[];
}

const IconEl = styled.div`
  display: inline;
  @media (max-width: 980px) {
    display: none;
  }
`;

export const GrapherComponent = (props: Props) => {
  const {
    data,
    indicators,
    regions,
    countries,
    lastUpdated,
  } = props;
  const {
    graphType,
    showSource,
    updateGraphType,
    updateShowSource,
  } = useContext(Context) as CtxDataType;
  const [modalVisibility, setModalVisibility] = useState(false);
  const queryParams = new URLSearchParams(window.location.search);
  return (
    <div className='margin-top-06 margin-bottom-06'>
      <div className='flex-div flex-space-between flex-vert-align-center margin-bottom-05 flex-wrap'>
        <div className='flex-div flex-vert-align-center'>
          <Logo height={75} />
          <div>
            <h3 className='undp-typography margin-bottom-00' style={{ color: 'var(--blue-600)' }}>COVID-19 Vaccine Equity Dashboard</h3>
            <h6 className='undp-typography margin-bottom-00'>
              Exploring inequities in the global distribution of COVID-19 vaccines
            </h6>
          </div>
        </div>
        <div className='flex-div'>
          {
            queryParams.get('embeded') === 'true' ? null
              : (
                <CopyLinkWithParamButton />
              )
          }
          <button className='undp-button button-primary' type='button' onClick={() => { setModalVisibility(true); }}>
            {
              window.innerWidth < 600 ? '</>' : 'Embed'
            }
          </button>
        </div>
      </div>
      <div className='dashboard-container'>
        {
          queryParams.get('showSettings') === 'false' ? null
            : (
              <div className='tabs-for-graphing-interface-container'>
                <button type='button' className={`tabs-for-graphing-interface${graphType === 'map' ? ' selected' : ''}`} onClick={() => { updateGraphType('map'); }}>
                  <IconEl>
                    <MapIcon size={48} fill={graphType === 'map' ? 'var(--blue-600)' : 'var(--gray-500)'} />
                  </IconEl>
                  <>Maps</>
                </button>
                <button type='button' className={`tabs-for-graphing-interface${graphType === 'scatterPlot' ? ' selected' : ''}`} onClick={() => { updateGraphType('scatterPlot'); }}>
                  <IconEl>
                    <ScatterPlotIcon size={48} fill={graphType === 'scatterPlot' ? 'var(--blue-600)' : 'var(--gray-500)'} />
                  </IconEl>
                  <>Correlation</>
                </button>
                <button type='button' className={`tabs-for-graphing-interface${graphType === 'barGraph' ? ' selected' : ''}`} onClick={() => { updateGraphType('barGraph'); }}>
                  <IconEl>
                    <BarGraphIcon size={48} fill={graphType === 'barGraph' ? 'var(--blue-600)' : 'var(--gray-500)'} />
                  </IconEl>
                  <>Ranks</>
                </button>
              </div>
            )
        }
        <div className='graph-container'>
          {
            queryParams.get('showSettings') === 'false' ? null
              : (
                <Settings
                  indicators={indicators}
                  regions={regions}
                  countries={countries}
                />
              )
          }
          <Graph
            data={data}
            indicators={indicators}
          />
        </div>
      </div>
      <Modal
        open={modalVisibility}
        className='undp-modal'
        title='Embed Code'
        onOk={() => { setModalVisibility(false); }}
        onCancel={() => { setModalVisibility(false); }}
        width='75%'
      >
        <GetEmbedParams />
      </Modal>
      <Modal
        open={showSource}
        className='undp-modal'
        title='Data Sources'
        onOk={() => { updateShowSource(false); }}
        onCancel={() => { updateShowSource(false); }}
        width='75%'
      >
        <DataSources
          indicators={indicators}
          data={data}
          lastUpdated={lastUpdated}
        />
      </Modal>
    </div>
  );
};
