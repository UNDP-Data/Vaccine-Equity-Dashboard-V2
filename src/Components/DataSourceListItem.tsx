import { CSVLink } from 'react-csv';
import { DataType, IndicatorMetaDataType, LastUpdatedDataType } from '../Types';
import DownloadExcel from './DownloadExcel';

interface Props {
    indicatorData: IndicatorMetaDataType;
    lastUpdated: LastUpdatedDataType[];
    data: DataType[];
}

const dataTable = (data: DataType[], indicator: IndicatorMetaDataType) => {
  const table: any = [];
  data.forEach((d) => {
    const country = d['Country or Area'];
    const countryCode = d['Alpha-3 code'];
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
    countryCode: d['Alpha-3 code'],
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
      <h5 className='bold undp-typography' style={{ padding: 'var(--spacing-07)' }}>{indicatorData.Indicator}</h5>
      <div className='flex-div margin-bottom-07' style={{ padding: '0 var(--spacing-07)' }}>
        <h6 className='undp-typography margin-top-03' style={{ width: '15%', flexShrink: 0 }}>Description</h6>
        <div>{indicatorData.IndicatorDescription}</div>
      </div>
      <div className='flex-div margin-bottom-07' style={{ padding: '0 var(--spacing-07)' }}>
        <h6 className='undp-typography margin-top-03' style={{ width: '15%', flexShrink: 0 }}>Data By</h6>
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
      </div>
      <div className='flex-div margin-bottom-07' style={{ padding: '0 var(--spacing-07)' }}>
        <h6 className='undp-typography margin-top-03' style={{ width: '15%', flexShrink: 0 }}>Data Link</h6>
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
      </div>
      <div className='flex-div margin-bottom-07' style={{ padding: '0 var(--spacing-07)' }}>
        <DownloadExcel
          data={dataTableForExcel(data, indicatorData)}
          indicatorTitle={indicatorData.Indicator}
        />
        <CSVLink
          headers={
            [
              { label: 'Country or Area', key: 'country' },
              { label: 'Alpha-3 code', key: 'countryCode' },
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
          <div className='undp-button button-secondary'>
            Download Data as CSV
          </div>
        </CSVLink>
      </div>
    </>
  );
};
