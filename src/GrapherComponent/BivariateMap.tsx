import {
  useContext, useEffect, useRef, useState,
} from 'react';
import styled from 'styled-components';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { format } from 'd3-format';
import { select } from 'd3-selection';
import maxBy from 'lodash.maxby';
import {
  scaleThreshold, scaleOrdinal, scaleSqrt,
} from 'd3-scale';
import {
  CtxDataType, DataType, HoverDataType, HoverRowDataType, IndicatorMetaDataType,
} from '../Types';
import Context from '../Context/Context';
import World from '../Data/worldMap.json';
import { COLOR_SCALES, LABEL_EXTRA } from '../Constants';
import { Tooltip } from '../Components/Tooltip';

interface Props {
  data: DataType[];
  indicators: IndicatorMetaDataType[];
}

const G = styled.g`
  pointer-events: none;
`;

export const BivariateMap = (props: Props) => {
  const {
    data,
    indicators,
  } = props;
  const {
    xAxisIndicator,
    yAxisIndicator,
    sizeIndicator,
    selectedCountries,
    selectedRegions,
    selectedIncomeGroups,
    selectedCountryGroup,
  } = useContext(Context) as CtxDataType;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(undefined);
  const queryParams = new URLSearchParams(window.location.search);
  const svgWidth = queryParams.get('showSettings') === 'false' && window.innerWidth > 960 ? 1280 : 960;
  const svgHeight = 678;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const projection = geoEqualEarth().rotate([0, 0]).scale(180).translate([470, 315]);
  const xIndicatorMetaData = indicators[indicators.findIndex((indicator) => indicator.Indicator === xAxisIndicator)];
  const yIndicatorMetaData = indicators[indicators.findIndex((indicator) => indicator.Indicator === yAxisIndicator)];

  const xDomain = xIndicatorMetaData.IsCategorical ? xIndicatorMetaData.Categories : xIndicatorMetaData.BinningRange5;
  const yDomain = yIndicatorMetaData.IsCategorical ? yIndicatorMetaData.Categories : yIndicatorMetaData.BinningRange5;

  const xRange = xIndicatorMetaData.IsCategorical || xIndicatorMetaData.Categories.length === 5
    ? xIndicatorMetaData.Categories.length === 10
      ? [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]
      : xIndicatorMetaData.Categories.length === 7 ? [0, 0, 1, 2, 3, 4, 4] : [0, 1, 2, 3, 4]
    : [0, 1, 2, 3, 4];
  const xKey = xIndicatorMetaData.IsCategorical
    ? xIndicatorMetaData.Categories.length === 10
      ? ['1,2', '3,4', '5,6', '7,8', '9,10']
      : xIndicatorMetaData.Categories.length === 7 ? ['1,2', '3', '4', '5', '6,7'] : [1, 2, 3, 4, 5]
    : xIndicatorMetaData.BinningRange5;
  const yKey = yIndicatorMetaData.IsCategorical
    ? yIndicatorMetaData.Categories.length === 10
      ? ['1,2', '3,4', '5,6', '7,8', '9,10']
      : yIndicatorMetaData.Categories.length === 7 ? ['1,2', '3', '4', '5', '6,7'] : [1, 2, 3, 4, 5]
    : yIndicatorMetaData.BinningRange5;

  const yRange = yIndicatorMetaData.IsCategorical || yIndicatorMetaData.Categories.length === 5
    ? yIndicatorMetaData.Categories.length === 10
      ? [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]
      : yIndicatorMetaData.Categories.length === 7 ? [0, 0, 1, 2, 3, 4, 4] : [0, 1, 2, 3, 4]
    : [0, 1, 2, 3, 4];

  const xScale = xIndicatorMetaData.IsCategorical ? scaleOrdinal<number, number>().domain(xDomain).range(xRange) : scaleThreshold<number, number>().domain(xDomain).range(xRange);
  const yScale = xIndicatorMetaData.IsCategorical ? scaleOrdinal<number, number>().domain(yDomain).range(yRange) : scaleThreshold<number, number>().domain(yDomain).range(yRange);
  const sizeIndicatorMetaData = indicators[indicators.findIndex((indicator) => indicator.Indicator === sizeIndicator)];
  const sizeMax = sizeIndicatorMetaData ? maxBy(data, (d) => d.data[d.data.findIndex((el) => el.indicator === sizeIndicatorMetaData.DataKey)]?.value) : undefined;
  const radiusScale = sizeIndicatorMetaData && sizeMax ? scaleSqrt().domain([0, sizeMax.data[sizeMax.data.findIndex((el) => el.indicator === sizeIndicatorMetaData.DataKey)].value as number]).range([0.25, 30]).nice() : undefined;
  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomBehaviour = zoom()
      .scaleExtent([1, 6])
      .translateExtent([[-20, 0], [svgWidth + 20, svgHeight]])
      .on('zoom', ({ transform }) => {
        mapGSelect.attr('transform', transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelect.call(zoomBehaviour as any);
  }, [svgHeight, svgWidth]);
  return (
    <>
      <svg width='100%' height='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`} ref={mapSvg}>
        <g ref={mapG}>
          {
            (World as any).features.map((d: any, i: number) => {
              const index = data.findIndex((el) => el['Alpha-3 code'] === d.properties.ISO3);
              if ((index !== -1) || d.properties.NAME === 'Antarctica') return null;
              return (
                <g
                  key={i}
                  opacity={!selectedColor ? 1 : 0.3}
                >
                  {
                  d.geometry.type === 'MultiPolygon' ? d.geometry.coordinates.map((el:any, j: number) => {
                    let masterPath = '';
                    el.forEach((geo: number[][]) => {
                      let path = ' M';
                      geo.forEach((c: number[], k: number) => {
                        const point = projection([c[0], c[1]]) as [number, number];
                        if (k !== geo.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                        else path = `${path}${point[0]} ${point[1]}`;
                      });
                      masterPath += path;
                    });
                    return (
                      <path
                        key={j}
                        d={masterPath}
                        stroke='#AAA'
                        strokeWidth={0.25}
                        fill={COLOR_SCALES.Null}
                      />
                    );
                  }) : d.geometry.coordinates.map((el:any, j: number) => {
                    let path = 'M';
                    el.forEach((c: number[], k: number) => {
                      const point = projection([c[0], c[1]]) as [number, number];
                      if (k !== el.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                      else path = `${path}${point[0]} ${point[1]}`;
                    });
                    return (
                      <path
                        key={j}
                        d={path}
                        stroke='#AAA'
                        strokeWidth={0.25}
                        fill={COLOR_SCALES.Null}
                      />
                    );
                  })
                }
                </g>
              );
            })
          }
          {
            data.map((d, i: number) => {
              const index = (World as any).features.findIndex((el: any) => d['Alpha-3 code'] === el.properties.ISO3);
              const xIndicatorIndex = d.data.findIndex((el) => xIndicatorMetaData.DataKey === el.indicator);
              const yIndicatorIndex = d.data.findIndex((el) => yIndicatorMetaData.DataKey === el.indicator);
              const xVal = xIndicatorIndex === -1 ? undefined : d.data[xIndicatorIndex].value;
              const yVal = yIndicatorIndex === -1 ? undefined : d.data[yIndicatorIndex].value;
              const xColorCoord = xVal !== undefined && xVal !== null ? xScale(xIndicatorMetaData.IsCategorical ? Math.floor(xVal) : xVal) : undefined;
              const yColorCoord = yVal !== undefined && yVal !== null ? yScale(yIndicatorMetaData.IsCategorical ? Math.floor(yVal) : yVal) : undefined;

              const color = xColorCoord !== undefined && yColorCoord !== undefined && xColorCoord !== null && yColorCoord !== null ? COLOR_SCALES.Bivariate[yColorCoord][xColorCoord] : COLOR_SCALES.Null;

              const regionOpacity = selectedRegions.length === 0 || selectedRegions.indexOf(d['Group 2']) !== -1;
              const incomeGroupOpacity = selectedIncomeGroups.length === 0 || selectedIncomeGroups.indexOf(d['Income group']) !== -1;
              const countryOpacity = selectedCountries.length === 0 || selectedCountries.indexOf(d['Country or Area']) !== -1;
              const countryGroupOpacity = selectedCountryGroup === 'All' ? true : d[selectedCountryGroup];
              const xIndicatorLabelExtraIndex = LABEL_EXTRA.findIndex((el) => el.forLabel === xIndicatorMetaData.DataKey) === -1 || xIndicatorIndex === -1 ? -1 : d.data.findIndex((el) => LABEL_EXTRA[LABEL_EXTRA.findIndex((el1) => el1.forLabel === xIndicatorMetaData.DataKey)].labelExtra === el.indicator);
              const xLabelExtra = xIndicatorLabelExtraIndex === -1 ? undefined : d.data[xIndicatorLabelExtraIndex].value;
              const yIndicatorLabelExtraIndex = LABEL_EXTRA.findIndex((el) => el.forLabel === yIndicatorMetaData.DataKey) === -1 || yIndicatorIndex === -1 ? -1 : d.data.findIndex((el) => LABEL_EXTRA[LABEL_EXTRA.findIndex((el1) => el1.forLabel === yIndicatorMetaData.DataKey)].labelExtra === el.indicator);
              const yLabelExtra = yIndicatorLabelExtraIndex === -1 ? undefined : d.data[yIndicatorLabelExtraIndex].value;

              const rowData: HoverRowDataType[] = [
                {
                  title: xAxisIndicator,
                  value: xVal === undefined || xVal === null ? 'NA' : xVal,
                  labelExtra: xLabelExtra,
                  type: 'color',
                  color,
                  prefix: xIndicatorMetaData?.LabelPrefix,
                  suffix: xIndicatorMetaData?.LabelSuffix,
                },
                {
                  title: yAxisIndicator,
                  value: yVal === undefined || yVal === null ? 'NA' : yVal,
                  type: 'color',
                  labelExtra: yLabelExtra,
                  color,
                  prefix: yIndicatorMetaData?.LabelPrefix,
                  suffix: yIndicatorMetaData?.LabelSuffix,
                },
              ];
              if (sizeIndicatorMetaData) {
                const sizeIndicatorIndex = d.data.findIndex((el) => sizeIndicatorMetaData?.DataKey === el.indicator);
                const sizeVal = sizeIndicatorIndex === -1 ? undefined : d.data[sizeIndicatorIndex].value;
                const sizeIndicatorLabelExtraIndex = LABEL_EXTRA.findIndex((el) => el.forLabel === sizeIndicatorMetaData.DataKey) === -1 || sizeIndicatorIndex === -1 ? -1 : d.data.findIndex((el) => LABEL_EXTRA[LABEL_EXTRA.findIndex((el1) => el1.forLabel === sizeIndicatorMetaData.DataKey)].labelExtra === el.indicator);
                const sizeLabelExtra = sizeIndicatorLabelExtraIndex === -1 ? undefined : d.data[sizeIndicatorLabelExtraIndex].value;

                rowData.push({
                  title: sizeIndicator,
                  value: sizeVal !== undefined && sizeVal !== null ? sizeVal : 'NA',
                  labelExtra: sizeLabelExtra,
                  type: 'size',
                  prefix: sizeIndicatorMetaData?.LabelPrefix,
                  suffix: sizeIndicatorMetaData?.LabelSuffix,
                });
              }

              return (
                <g
                  key={i}
                  opacity={
                    selectedColor
                      ? selectedColor === color ? 1 : 0.1
                      : regionOpacity && incomeGroupOpacity && countryOpacity && countryGroupOpacity ? 1 : 0.1
                  }
                  onMouseEnter={(event) => {
                    setHoverData({
                      country: d['Country or Area'],
                      continent: d['Group 1'],
                      rows: rowData,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                    });
                  }}
                  onMouseMove={(event) => {
                    setHoverData({
                      country: d['Country or Area'],
                      continent: d['Group 1'],
                      rows: rowData,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoverData(undefined);
                  }}
                >
                  {
                    index === -1 ? null
                      : (World as any).features[index].geometry.type === 'MultiPolygon' ? (World as any).features[index].geometry.coordinates.map((el:any, j: number) => {
                        let masterPath = '';
                        el.forEach((geo: number[][]) => {
                          let path = ' M';
                          geo.forEach((c: number[], k: number) => {
                            const point = projection([c[0], c[1]]) as [number, number];
                            if (k !== geo.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                            else path = `${path}${point[0]} ${point[1]}`;
                          });
                          masterPath += path;
                        });
                        return (
                          <path
                            key={j}
                            d={masterPath}
                            stroke={color === COLOR_SCALES.Null ? '#AAA' : '#FFF'}
                            strokeWidth={0.25}
                            fill={color}
                          />
                        );
                      }) : (World as any).features[index].geometry.coordinates.map((el:any, j: number) => {
                        let path = 'M';
                        el.forEach((c: number[], k: number) => {
                          const point = projection([c[0], c[1]]) as [number, number];
                          if (k !== el.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                          else path = `${path}${point[0]} ${point[1]}`;
                        });
                        return (
                          <path
                            key={j}
                            d={path}
                            stroke={color === COLOR_SCALES.Null ? '#AAA' : '#FFF'}
                            strokeWidth={0.25}
                            fill={color}
                          />
                        );
                      })
                  }
                </g>
              );
            })
          }
          {
            hoverData
              ? (World as any).features.filter((d: any) => d.properties.ISO3 === data[data.findIndex((el: DataType) => el['Country or Area'] === hoverData?.country)]['Alpha-3 code']).map((d: any, i: number) => (
                <G
                  key={i}
                  opacity={!selectedColor ? 1 : 0}
                >
                  {
                    d.geometry.type === 'MultiPolygon' ? d.geometry.coordinates.map((el:any, j: number) => {
                      let masterPath = '';
                      el.forEach((geo: number[][]) => {
                        let path = ' M';
                        geo.forEach((c: number[], k: number) => {
                          const point = projection([c[0], c[1]]) as [number, number];
                          if (k !== geo.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                          else path = `${path}${point[0]} ${point[1]}`;
                        });
                        masterPath += path;
                      });
                      return (
                        <path
                          key={j}
                          d={masterPath}
                          stroke='#212121'
                          opacity={1}
                          strokeWidth={1}
                          fillOpacity={0}
                          fill={COLOR_SCALES.Null}
                        />
                      );
                    }) : d.geometry.coordinates.map((el:any, j: number) => {
                      let path = 'M';
                      el.forEach((c: number[], k: number) => {
                        const point = projection([c[0], c[1]]) as [number, number];
                        if (k !== el.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                        else path = `${path}${point[0]} ${point[1]}`;
                      });
                      return (
                        <path
                          key={j}
                          d={path}
                          stroke='#212121'
                          opacity={1}
                          strokeWidth={1}
                          fillOpacity={0}
                          fill='none'
                        />
                      );
                    })
                  }
                </G>
              )) : null
          }
          {
            sizeIndicatorMetaData ? (
              <>
                {
                  data.map((d, i) => {
                    const sizeIndicatorIndex = d.data.findIndex((el) => sizeIndicatorMetaData.DataKey === el.indicator);
                    const sizeVal = sizeIndicatorIndex === -1 ? undefined : d.data[sizeIndicatorIndex].value;
                    const center = projection([d['Longitude (average)'], d['Latitude (average)']]) as [number, number];
                    const xIndicatorIndex = d.data.findIndex((el) => xIndicatorMetaData.DataKey === el.indicator);
                    const yIndicatorIndex = d.data.findIndex((el) => yIndicatorMetaData.DataKey === el.indicator);
                    const xVal = xIndicatorIndex === -1 ? undefined : d.data[xIndicatorIndex].value;
                    const yVal = yIndicatorIndex === -1 ? undefined : d.data[yIndicatorIndex].value;
                    const xColorCoord = xVal !== undefined && xVal !== null ? xScale(xIndicatorMetaData.IsCategorical ? Math.floor(xVal) : xVal) : undefined;
                    const yColorCoord = yVal !== undefined && yVal !== null ? yScale(yIndicatorMetaData.IsCategorical ? Math.floor(yVal) : yVal) : undefined;

                    const color = xColorCoord !== undefined && yColorCoord !== undefined && xColorCoord !== null && yColorCoord !== null ? COLOR_SCALES.Bivariate[yColorCoord][xColorCoord] : COLOR_SCALES.Null;

                    const regionOpacity = selectedRegions.length === 0 || selectedRegions.indexOf(d['Group 2']) !== -1;
                    const incomeGroupOpacity = selectedIncomeGroups.length === 0 || selectedIncomeGroups.indexOf(d['Income group']) !== -1;
                    const countryOpacity = selectedCountries.length === 0 || selectedCountries.indexOf(d['Country or Area']) !== -1;
                    const countryGroupOpacity = selectedCountryGroup === 'All' ? true : d[selectedCountryGroup];
                    const rowData: HoverRowDataType[] = [
                      {
                        title: xAxisIndicator,
                        value: xVal === undefined || xVal === null ? 'NA' : xVal,
                        type: 'color',
                        color,
                        prefix: xIndicatorMetaData?.LabelPrefix,
                        suffix: xIndicatorMetaData?.LabelSuffix,
                      },
                      {
                        title: yAxisIndicator,
                        value: yVal === undefined || yVal === null ? 'NA' : yVal,
                        type: 'color',
                        color,
                        prefix: yIndicatorMetaData?.LabelPrefix,
                        suffix: yIndicatorMetaData?.LabelSuffix,
                      },
                    ];
                    if (sizeIndicatorMetaData) {
                      rowData.push({
                        title: sizeIndicator,
                        value: sizeVal !== undefined && sizeVal !== null ? sizeVal : 'NA',
                        type: 'size',
                        prefix: sizeIndicatorMetaData?.LabelPrefix,
                        suffix: sizeIndicatorMetaData?.LabelSuffix,
                      });
                    }

                    return (
                      <circle
                        key={i}
                        onMouseEnter={(event) => {
                          setHoverData({
                            country: d['Country or Area'],
                            continent: d['Group 1'],
                            rows: rowData,
                            xPosition: event.clientX,
                            yPosition: event.clientY,
                          });
                        }}
                        onMouseMove={(event) => {
                          setHoverData({
                            country: d['Country or Area'],
                            continent: d['Group 1'],
                            rows: rowData,
                            xPosition: event.clientX,
                            yPosition: event.clientY,
                          });
                        }}
                        onMouseLeave={() => {
                          setHoverData(undefined);
                        }}
                        cx={center[0]}
                        cy={center[1]}
                        r={sizeVal !== undefined && sizeVal !== null && radiusScale ? radiusScale(sizeVal) : 0}
                        stroke='#212121'
                        strokeWidth={1}
                        fill='none'
                        opacity={
                          hoverData ? hoverData.country === d['Country or Area'] ? 1 : 0.1
                            : selectedColor
                              ? selectedColor === color ? 1 : 0.1
                              : regionOpacity && incomeGroupOpacity && countryOpacity && countryGroupOpacity ? 1 : 0.1
                        }
                      />
                    );
                  })
                }
              </>
            ) : null
          }
        </g>
      </svg>
      <div className='bivariate-legend-container'>
        <div className='bivariate-legend-el'>
          <div className='bivariate-map-color-legend-element'>
            <div
              style={{
                display: 'flex',
                pointerEvents: 'auto',
              }}
            >
              <div>
                <svg width='135px' viewBox={`0 0 ${135} ${135}`}>
                  <g>
                    {
                    COLOR_SCALES.Bivariate.map((d, i) => (
                      <g
                        key={i}
                        transform={`translate(0,${100 - (i * 25)})`}
                      >
                        {
                          d.map((el, j) => (
                            <rect
                              key={j}
                              y={1}
                              x={(j * 25) + 1}
                              fill={el}
                              width={23}
                              height={23}
                              strokeWidth={2}
                              stroke={selectedColor === el ? '#212121' : el}
                              style={{ cursor: 'pointer' }}
                              onMouseOver={() => { setSelectedColor(el); }}
                              onMouseLeave={() => { setSelectedColor(undefined); }}
                            />
                          ))
                        }
                      </g>
                    ))
                  }
                    <g
                      transform='translate(0,125)'
                    >
                      {
                      xKey.map((el, j) => (
                        <text
                          key={j}
                          y={10}
                          x={xKey.length === 5 ? (j * 25) + 12.5 : (j + 1) * 25}
                          fill='#212121'
                          fontSize={10}
                          textAnchor='middle'
                        >
                          {typeof el === 'string' || el < 1 ? el : format('~s')(el)}
                        </text>
                      ))
                    }
                    </g>
                    {
                      yKey.map((el, j) => (
                        <g
                          key={j}
                          transform={`translate(135,${yKey.length !== 5 ? 100 - (j * 25) : 100 - (j * 25) + 12.5})`}
                        >
                          <text
                            x={0}
                            transform='rotate(-90)'
                            y={0}
                            fill='#212121'
                            fontSize={10}
                            textAnchor='middle'
                          >
                            {typeof el === 'string' || el < 1 ? el : format('~s')(el)}
                          </text>
                        </g>
                      ))
                    }
                  </g>
                </svg>
                <div className='bivariant-map-primary-legend-text'>{xIndicatorMetaData.Indicator}</div>
              </div>
              <div className='bivariate-map-secondary-legend-text'>{yIndicatorMetaData.Indicator}</div>
            </div>
          </div>
          {
            sizeIndicator && radiusScale
              ? (
                <div className='bivariate-map-size-legend-element'>
                  <>
                    <div className='bivariate-map-size-legend-text'>{sizeIndicatorMetaData.Indicator}</div>
                    <svg width='135' height='90' viewBox='0 0 175 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <text fontSize={12} fontWeight={700} textAnchor='middle' fill='#212121' x={4} y={95}>0</text>
                      <text fontSize={12} fontWeight={700} textAnchor='middle' fill='#212121' x={130} y={95}>{radiusScale.invert(40) > 1 ? format('~s')(radiusScale.invert(40)) : radiusScale.invert(40)}</text>
                      <path d='M4 41L130 0V80L4 41Z' fill='#E9ECF6' />
                      <circle cx='4' cy='41' r='0.25' fill='white' stroke='#212121' strokeWidth='2' />
                      <circle cx='130' cy='41' r='40' fill='white' stroke='#212121' strokeWidth='2' />
                    </svg>
                  </>
                </div>
              )
              : null
          }
        </div>
      </div>
      {
        hoverData ? <Tooltip data={hoverData} /> : null
      }
    </>
  );
};
