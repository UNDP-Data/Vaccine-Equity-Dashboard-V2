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

interface SelectedData {
  selected?: boolean;
}

const TabsEl = styled.button<SelectedData>`
  font-size: 0.875rem;
  padding: var(--spacing-04) 0;
  min-width: 6.25rem;
  flex-grow: 1;
  width: 15%;
  max-width: 17.5rem;
  text-transform: uppercase;
  justify-content: center;
  background-color:${(props) => (props.selected ? 'var(--white)' : 'transparent')};
  color:${(props) => (props.selected ? 'var(--blue-600)' : 'var(--gray-700)')};
  text-align: center;
  border: 0;
  border-right: 1px solid var(--gray-500);
  opacity :${(props) => (props.selected ? 1 : 0.8)};
  cursor: pointer;
  div{
    margin-bottom: 0.5rem;
  }
  &:hover {
    opacity: 1;
  }
  @media (max-width: 1172px) {
    width: 20%;
    font-size: 0.75rem;
    &:last-of-type {
      border-right: 0 solid var(--gray-500);
    }
  }
  @media (max-width: 900px) {
    width: fit-content;
    font-size: 0.75rem;
    min-width: 0;
    padding: var(--spacing-04) var(--spacing-06);
    &:last-of-type {
      border-right: 1px solid var(--gray-500);
    }
  }
  @media (max-width: 700px) {
    font-size: 0.75rem;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const GraphEl = styled.div`
  display: flex;
  align-items: stretch;
  @media (max-width: 960px) {
    display: inline;
  }  
`;

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
      <div
        style={{
          backgroundColor: 'var(--gray-100)',
          border: '1px solid var(--gray-400)',
        }}
      >
        {
            queryParams.get('showSettings') === 'false' ? null
              : (
                <div className='flex-div' style={{ backgroundColor: 'var(--gray-200)', gap: '0' }}>
                  <TabsEl selected={graphType === 'map'} onClick={() => { updateGraphType('map'); }}>
                    <IconEl>
                      <MapIcon size={48} fill={graphType === 'map' ? 'var(--blue-600)' : 'var(--gray-500)'} />
                    </IconEl>
                    <>Maps</>
                  </TabsEl>
                  <TabsEl selected={graphType === 'scatterPlot'} onClick={() => { updateGraphType('scatterPlot'); }}>
                    <IconEl>
                      <ScatterPlotIcon size={48} fill={graphType === 'scatterPlot' ? 'var(--blue-600)' : 'var(--gray-500)'} />
                    </IconEl>
                    <>Correlation</>
                  </TabsEl>
                  <TabsEl selected={graphType === 'barGraph'} onClick={() => { updateGraphType('barGraph'); }}>
                    <IconEl>
                      <BarGraphIcon size={48} fill={graphType === 'barGraph' ? 'var(--blue-600)' : 'var(--gray-500)'} />
                    </IconEl>
                    <>Ranks</>
                  </TabsEl>
                </div>
              )
          }
        <GraphEl>
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
          {
            showSource
              ? (
                <DataSources
                  indicators={indicators}
                  data={data}
                  lastUpdated={lastUpdated}
                />
              )
              : (
                <Graph
                  data={data}
                  indicators={indicators}
                  fullWidth={queryParams.get('showSettings') === 'false'}
                />
              )
          }
        </GraphEl>
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
    </div>
  );
};
