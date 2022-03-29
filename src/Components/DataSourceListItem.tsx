import { CSVLink } from 'react-csv';
import styled from 'styled-components';
import { DataType, IndicatorMetaDataType, LastUpdatedDataType } from '../Types';
import DownloadExcel from './DownloadExcel';

interface Props {
    indicatorData: IndicatorMetaDataType;
    lastUpdated: LastUpdatedDataType[];
    data: DataType[];
}

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

const dataTableForExcel = (data: DataType[], indicator: IndicatorMetaDataType) => {
  const table: any = data.map((d) => ({
    country: d['Country or Area'],
    countryCode: d['Alpha-3 code-1'],
    value: d.data[d.data.findIndex((el) => el.indicator === indicator.DataKey)]?.value,
  }));
  return table;
};

export const DataSourceListItem = (props: Props) => {
  const {
    indicatorData,
    lastUpdated,
    data,
  } = props;

  return (
    <>
      <TitleEl>{indicatorData.Indicator}</TitleEl>
      <RowEl>
        <FirstColumn>Description</FirstColumn>
        <div>{indicatorData.IndicatorDescription}</div>
      </RowEl>
      <RowEl>
        <FirstColumn>Data By</FirstColumn>
        <div>
          {
            indicatorData.DataSourceName.split(';').map((d, i) => (
              <div key={i}>
                {d}
                {' '}
                (last updated:
                {' '}
                {lastUpdated.findIndex((el) => el.Source === d) !== -1 ? lastUpdated[lastUpdated.findIndex((el) => el.Source === d)].Date : null}
                )
              </div>
            ))
          }
        </div>
      </RowEl>
      <RowEl>
        <FirstColumn>Data Link</FirstColumn>
        {
          indicatorData.DataSourceLink !== '' && indicatorData.DataSourceLink !== undefined
            ? (
              <div>
                {
                  indicatorData.DataSourceLink.split(';').map((d, i) => (
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
        <DownloadExcel
          data={dataTableForExcel(data, indicatorData)}
          indicatorTitle={indicatorData.Indicator}
        />
        <CSVLink
          headers={
            [
              { label: 'Country or Area', key: 'country' },
              { label: 'Alpha-3 code-1', key: 'countryCode' },
              { label: indicatorData.Indicator, key: 'value' },
            ]
          }
          enclosingCharacter=''
          separator=';'
          data={dataTable(data, indicatorData)}
          filename={`${indicatorData.Indicator.replaceAll(',', '').replaceAll('.', ' ')}.csv`}
          asyncOnClick
          target='_blank'
        >
          <DownloadButton>
            Download Data as CSV
          </DownloadButton>
        </CSVLink>
      </RowEl>
    </>
  );
};
