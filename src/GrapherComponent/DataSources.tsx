import { useContext } from 'react';
import styled from 'styled-components';
import { CSVLink } from 'react-csv';
import { CtxDataType, DataType, IndicatorMetaDataType } from '../Types';
import Context from '../Context/Context';

interface Props {
  indicators: IndicatorMetaDataType[];
  data: DataType[];
}

const El = styled.div`
  width: 75%;
  box-shadow: var(--shadow-right);
  height: 74rem;
  overflow: auto;
`;

const TitleEl = styled.div`
  font-weight: bold;
  font-size: 1.6rem;
  color: var(--black-700);
  margin: 1rem 0;
  padding: 0 2rem;
`;

const RowEl = styled.div`
  display: flex;
  font-size: 1.4rem;
  color: var(--black-700);
  margin: 1rem 0;
  padding: 0 2rem;
  line-height: 2rem;
`;

const FirstColumn = styled.div`
  width: 15rem; 
  flex-shrink: 0;
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

const YearEl = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.5rem;
`;

const DownloadButton = styled.div`
  border-radius: 0.2rem;
  font-size: 1.4rem;
  font-weight: normal;
  color: var(--black-600);
  border: 1px solid var(--black-450);
  cursor: pointer;
  padding: 0.4rem 1rem;
  margin: 2rem 0 1rem 0;
  background-color: var(--white);
  &:hover {
    border: 1px solid var(--primary-blue);
    color: var(--primary-blue);
  }
  &:active{
    border: 1px solid var(--primary-blue);
    color: var(--primary-blue);
  }
`;

const HR = styled.hr`
  margin: 0 2rem 2rem 2rem;
  border: 1px solid var(--black-400);
`;

const dataTable = (data: DataType[], indicator: IndicatorMetaDataType) => {
  const table: any = [];
  data.forEach((d) => {
    const country = d['Country or Area'];
    const countryCode = d['Alpha-3 code-1'];
    const value = d.data[d.data.findIndex((el) => el.indicator === indicator.DataKey)]?.value;
    table.push({
      country,
      countryCode,
      value,
    });
  });
  return table;
};

export const DataSources = (props: Props) => {
  const {
    indicators,
    data,
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
      <TitleEl>{xIndicatorMetaData.Indicator}</TitleEl>
      <RowEl>
        <FirstColumn>Description</FirstColumn>
        <div>{xIndicatorMetaData.IndicatorDescription}</div>
      </RowEl>
      <RowEl>
        <FirstColumn>Last Updated</FirstColumn>
        <YearEl>01-Jan-2020</YearEl>
      </RowEl>
      <RowEl>
        <FirstColumn>Data By</FirstColumn>
        <div>{xIndicatorMetaData.DataSourceName}</div>
      </RowEl>
      <RowEl>
        <FirstColumn>Data Link</FirstColumn>
        {
          xIndicatorMetaData.DataSourceLink !== '' && xIndicatorMetaData.DataSourceLink !== undefined
            ? (
              <div>
                {
                  xIndicatorMetaData.DataSourceLink.split(';').map((d, i) => (
                    <div key={i}>
                      <a href={d} target='_blank' rel='noreferrer'>
                        {d}
                      </a>
                    </div>
                  ))
                }
              </div>
            )
            : <div />
        }
      </RowEl>
      <RowEl>
        <CSVLink
          headers={
            [
              { label: 'Country or Area', key: 'country' },
              { label: 'Alpha-3 code-1', key: 'countryCode' },
              { label: 'Year', key: 'year' },
              { label: xIndicatorMetaData.Indicator, key: 'value' },
            ]
          }
          enclosingCharacter=''
          separator=';'
          data={dataTable(data, xIndicatorMetaData)}
          filename={`${xIndicatorMetaData.Indicator.replaceAll(',', '').replaceAll('.', ' ')}.csv`}
          asyncOnClick
          target='_blank'
        >
          <DownloadButton>
            Download Data
          </DownloadButton>
        </CSVLink>
      </RowEl>
      {
        graphType !== 'barGraph' && yIndicatorMetaData ? (
          <>
            <HR />
            <TitleEl>{yIndicatorMetaData.Indicator}</TitleEl>
            <RowEl>
              <FirstColumn>Description</FirstColumn>
              <div>{yIndicatorMetaData.IndicatorDescription}</div>
            </RowEl>
            <RowEl>
              <FirstColumn>Last Updated</FirstColumn>
              <YearEl>01-Jan-2020</YearEl>
            </RowEl>
            <RowEl>
              <FirstColumn>Data By</FirstColumn>
              <div>{yIndicatorMetaData.DataSourceName}</div>
            </RowEl>
            <RowEl>
              <FirstColumn>Data Link</FirstColumn>
              {
                yIndicatorMetaData.DataSourceLink !== '' && yIndicatorMetaData.DataSourceLink !== undefined
                  ? (
                    <div>
                      {
                        yIndicatorMetaData.DataSourceLink.split(';').map((d, i) => (
                          <div key={i}>
                            <a href={d} target='_blank' rel='noreferrer'>
                              {d}
                            </a>
                          </div>
                        ))
                      }
                    </div>
                  )
                  : <div />
              }
            </RowEl>
            <RowEl>
              <CSVLink
                headers={
                  [
                    { label: 'Country or Area', key: 'country' },
                    { label: 'Alpha-3 code-1', key: 'countryCode' },
                    { label: 'Year', key: 'year' },
                    { label: yIndicatorMetaData.Indicator, key: 'value' },
                  ]
                }
                enclosingCharacter=''
                separator=';'
                data={dataTable(data, yIndicatorMetaData)}
                filename={`${yIndicatorMetaData.Indicator.replaceAll(',', '').replaceAll('.', ' ')}.csv`}
                asyncOnClick
                target='_blank'
              >
                <DownloadButton>
                  Download Data
                </DownloadButton>
              </CSVLink>
            </RowEl>
          </>
        ) : null
      }
      {
        graphType !== 'map' && colorIndicatorMetaData ? (
          <>
            <HR />
            <TitleEl>{colorIndicatorMetaData.Indicator}</TitleEl>
            <RowEl>
              <FirstColumn>Description</FirstColumn>
              <div>{colorIndicatorMetaData.IndicatorDescription}</div>
            </RowEl>
            <RowEl>
              <FirstColumn>Last Updated</FirstColumn>
              <YearEl>01-Jan-2020</YearEl>
            </RowEl>
            <RowEl>
              <FirstColumn>Data By</FirstColumn>
              <div>{colorIndicatorMetaData.DataSourceName}</div>
            </RowEl>
            <RowEl>
              <FirstColumn>Data Link</FirstColumn>
              {
                colorIndicatorMetaData.DataSourceLink !== '' && colorIndicatorMetaData.DataSourceLink !== undefined
                  ? (
                    <div>
                      {
                        colorIndicatorMetaData.DataSourceLink.split(';').map((d, i) => (
                          <div key={i}>
                            <a href={d} target='_blank' rel='noreferrer'>
                              {d}
                            </a>
                          </div>
                        ))
                      }
                    </div>
                  )
                  : <div />
              }
            </RowEl>
            <RowEl>
              <CSVLink
                headers={
                  [
                    { label: 'Country or Area', key: 'country' },
                    { label: 'Alpha-3 code-1', key: 'countryCode' },
                    { label: 'Year', key: 'year' },
                    { label: colorIndicatorMetaData.Indicator, key: 'value' },
                  ]
                }
                enclosingCharacter=''
                separator=';'
                data={dataTable(data, colorIndicatorMetaData)}
                filename={`${colorIndicatorMetaData.Indicator.replaceAll(',', '').replaceAll('.', ' ')}.csv`}
                asyncOnClick
                target='_blank'
              >
                <DownloadButton>
                  Download Data
                </DownloadButton>
              </CSVLink>
            </RowEl>
          </>
        ) : null
      }
      {
        (graphType === 'scatterPlot' || graphType === 'map') && sizeIndicatorMetaData ? (
          <>
            <HR />
            <TitleEl>{sizeIndicatorMetaData.Indicator}</TitleEl>
            <RowEl>
              <FirstColumn>Description</FirstColumn>
              <div>{sizeIndicatorMetaData.IndicatorDescription}</div>
            </RowEl>
            <RowEl>
              <FirstColumn>Last Updated</FirstColumn>
              <YearEl>01-Jan-2020</YearEl>
            </RowEl>
            <RowEl>
              <FirstColumn>Data By</FirstColumn>
              <div>{sizeIndicatorMetaData.DataSourceName}</div>
            </RowEl>
            <RowEl>
              <FirstColumn>Data Link</FirstColumn>
              {
                sizeIndicatorMetaData.DataSourceLink !== '' && sizeIndicatorMetaData.DataSourceLink !== undefined
                  ? (
                    <div>
                      {
                        sizeIndicatorMetaData.DataSourceLink.split(';').map((d, i) => (
                          <div key={i}>
                            <a href={d} target='_blank' rel='noreferrer'>
                              {d}
                            </a>
                          </div>
                        ))
                      }
                    </div>
                  )
                  : <div />
              }
            </RowEl>
            <RowEl>
              <CSVLink
                headers={
                  [
                    { label: 'Country or Area', key: 'country' },
                    { label: 'Alpha-3 code-1', key: 'countryCode' },
                    { label: 'Year', key: 'year' },
                    { label: sizeIndicatorMetaData.Indicator, key: 'value' },
                  ]
                }
                enclosingCharacter=''
                separator=';'
                data={dataTable(data, sizeIndicatorMetaData)}
                filename={`${sizeIndicatorMetaData.Indicator.replaceAll(',', '').replaceAll('.', ' ')}.csv`}
                asyncOnClick
                target='_blank'
              >
                <DownloadButton>
                  Download Data
                </DownloadButton>
              </CSVLink>
            </RowEl>
          </>
        ) : null
      }
    </El>
  );
};
