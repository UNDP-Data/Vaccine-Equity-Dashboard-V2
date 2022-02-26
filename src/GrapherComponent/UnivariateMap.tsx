import {
  useContext, useEffect, useRef, useState,
} from 'react';
import styled from 'styled-components';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { format } from 'd3-format';
import { select } from 'd3-selection';
import maxBy from 'lodash.maxby';
import max from 'lodash.max';
import { scaleThreshold, scaleOrdinal, scaleLinear } from 'd3-scale';
import {
  CtxDataType, DataType, HoverDataType, HoverRowDataType, IndicatorMetaDataWithYear,
} from '../Types';
import Context from '../Context/Context';
import World from '../Data/worldMap.json';
import { COLOR_SCALES } from '../Constants';
import { Tooltip } from '../Components/Tooltip';

interface Props {
  data: DataType[];
  indicators: IndicatorMetaDataWithYear[];
}

const El = styled.div`
  height: calc(100% - 71px);
`;

const LegendEl = styled.div`
  padding: 1rem 1rem 0 1rem;
  background-color:rgba(255,255,255,0.1);
  box-shadow: var(--shadow);
  width: 32rem;
  margin-left: 1rem;
  margin-top: -2rem;
  transform: translateY(-100%);
  position: relative;
  z-index: 1000;
`;

const TitleEl = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UnivariateMap = (props: Props) => {
  const {
    data,
    indicators,
  } = props;
  const {
    year,
    xAxisIndicator,
    sizeIndicator,
    selectedCountries,
    showMostRecentData,
    selectedRegions,
    selectedIncomeGroups,
    selectedCountryGroup,
  } = useContext(Context) as CtxDataType;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(undefined);
  const svgWidth = 960;
  const svgHeight = 678;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const projection = geoEqualEarth().rotate([0, 0]).scale(200).translate([450, 350]);
  const xIndicatorMetaData = indicators[indicators.findIndex((indicator) => indicator.IndicatorLabelTable === xAxisIndicator)];
  const sizeIndicatorMetaData = indicators[indicators.findIndex((indicator) => indicator.IndicatorLabelTable === sizeIndicator)];
  const valueArray = xIndicatorMetaData.IsCategorical ? xIndicatorMetaData.Categories : xIndicatorMetaData.BinningRangeLarge.length === 0 ? xIndicatorMetaData.BinningRange5 : xIndicatorMetaData.BinningRangeLarge;
  const colorArray = xIndicatorMetaData.IsDivergent ? COLOR_SCALES.Divergent[`Color${(valueArray.length + 1) as 4 | 5 | 7 | 9 | 11}`] : COLOR_SCALES.Linear[`RedColor${(valueArray.length + 1) as 4 | 5 | 6 | 7 | 8 | 9 | 10}`];
  const colorScale = xIndicatorMetaData.IsCategorical ? scaleOrdinal<number, string>().domain(valueArray).range(colorArray) : scaleThreshold<number, string>().domain(valueArray).range(colorArray);

  const maxRadiusValue = [0];
  if (sizeIndicator) {
    data.forEach((d) => {
      const indicatorIndex = d.indicators.findIndex((el) => sizeIndicatorMetaData.DataKey === el.indicator);
      if (indicatorIndex !== -1) {
        if (maxBy(d.indicators[indicatorIndex].yearlyData, (el) => el.value)?.value !== undefined) { maxRadiusValue.push(maxBy(d.indicators[indicatorIndex].yearlyData, (el) => el.value)?.value as number); }
      }
    });
  }
  const radiusScale = scaleLinear().domain([0, max(maxRadiusValue) as number]).range([0.25, 40]).nice();
  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomBehaviour = zoom()
      .scaleExtent([1, 3])
      .translateExtent([[0, 0], [svgWidth, svgHeight]])
      .on('zoom', ({ transform }) => {
        mapGSelect.attr('transform', transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelect.call(zoomBehaviour as any);
  }, [svgHeight, svgWidth]);
  return (
    <El>
      <svg width='100%' height='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`} ref={mapSvg}>
        <g ref={mapG}>
          {
            (World as any).features.map((d: any, i: number) => {
              const index = data.findIndex((el: any) => el['Alpha-3 code-1'] === d.properties.ISO3);
              if ((index !== -1) || d.properties.NAME === 'Antarctica') return null;
              return (
                <g
                  key={i}
                  opacity={!selectedColor ? 1 : 0.3}
                >
                  {
                  d.geometry.type === 'MultiPolygon' ? d.geometry.coordinates.map((el:any, j: any) => {
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
                        stroke='#fff'
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
                        stroke='#fff'
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
              const index = (World as any).features.findIndex((el: any) => d['Alpha-3 code-1'] === el.properties.ISO3);
              const indicatorIndex = d.indicators.findIndex((el) => xIndicatorMetaData.DataKey === el.indicator);
              const val = indicatorIndex === -1 ? undefined
                : year !== -1 && !showMostRecentData ? d.indicators[indicatorIndex].yearlyData[d.indicators[indicatorIndex].yearlyData.findIndex((el) => el.year === year)]?.value
                  : d.indicators[indicatorIndex].yearlyData[d.indicators[indicatorIndex].yearlyData.length - 1]?.value;
              const color = val !== undefined ? colorScale(xIndicatorMetaData.IsCategorical ? Math.floor(val) : val) : COLOR_SCALES.Null;

              const regionOpacity = selectedRegions.length === 0 || selectedRegions.indexOf(d['Group 2']) !== -1;
              const incomeGroupOpacity = selectedIncomeGroups.length === 0 || selectedIncomeGroups.indexOf(d['Income group']) !== -1;
              const countryOpacity = selectedCountries.length === 0 || selectedCountries.indexOf(d['Country or Area']) !== -1;
              const countryGroupOpacity = selectedCountryGroup === 'All' ? true : d[selectedCountryGroup];
              const selectedColorOpacity = !selectedColor || selectedColor === color;

              const rowData: HoverRowDataType[] = [
                {
                  title: xAxisIndicator,
                  value: val === undefined ? 'NA' : `${xIndicatorMetaData?.LabelPrefix} ${val} ${xIndicatorMetaData?.LabelSuffix}`,
                  type: 'color',
                  year: year === -1 || showMostRecentData ? d.indicators[indicatorIndex].yearlyData[d.indicators[indicatorIndex].yearlyData.length - 1]?.year : year,
                  color,
                },
              ];
              if (sizeIndicatorMetaData) {
                const sizeIndicatorIndex = d.indicators.findIndex((el) => sizeIndicatorMetaData?.DataKey === el.indicator);
                const sizeVal = sizeIndicatorIndex === -1 ? undefined
                  : year !== -1 && !showMostRecentData ? d.indicators[sizeIndicatorIndex].yearlyData[d.indicators[sizeIndicatorIndex].yearlyData.findIndex((el) => el.year === year)]?.value
                    : d.indicators[sizeIndicatorIndex].yearlyData[d.indicators[sizeIndicatorIndex].yearlyData.length - 1]?.value;
                rowData.push({
                  title: sizeIndicator,
                  value: sizeVal ? `${sizeIndicatorMetaData?.LabelPrefix} ${sizeVal} ${sizeIndicatorMetaData?.LabelSuffix}` : sizeVal,
                  type: 'size',
                  year: year === -1 || showMostRecentData ? d.indicators[sizeIndicatorIndex].yearlyData[d.indicators[sizeIndicatorIndex].yearlyData.length - 1]?.year : year,
                });
              }
              return (
                <g
                  key={i}
                  opacity={regionOpacity && incomeGroupOpacity && countryOpacity && countryGroupOpacity && selectedColorOpacity ? 1 : 0.3}
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
                      : (World as any).features[index].geometry.type === 'MultiPolygon' ? (World as any).features[index].geometry.coordinates.map((el:any, j: any) => {
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
                            stroke={hoverData?.country === d['Country or Area'] ? '#212121' : '#fff'}
                            strokeWidth={hoverData?.country === d['Country or Area'] ? 2 : 0.25}
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
                            stroke={hoverData?.country === d['Country or Area'] ? '#212121' : '#fff'}
                            strokeWidth={hoverData?.country === d['Country or Area'] ? 2 : 0.25}
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
            sizeIndicatorMetaData ? (
              <>
                {
                  data.map((d, i) => {
                    const sizeIndicatorIndex = d.indicators.findIndex((el) => sizeIndicatorMetaData.DataKey === el.indicator);
                    const sizeVal = sizeIndicatorIndex === -1 ? undefined
                      : year !== -1 && !showMostRecentData ? d.indicators[sizeIndicatorIndex].yearlyData[d.indicators[sizeIndicatorIndex].yearlyData.findIndex((el) => el.year === year)]?.value
                        : d.indicators[sizeIndicatorIndex].yearlyData[d.indicators[sizeIndicatorIndex].yearlyData.length - 1]?.value;
                    const center = projection([d['Longitude (average)'], d['Latitude (average)']]) as [number, number];
                    const indicatorIndex = d.indicators.findIndex((el) => xIndicatorMetaData.DataKey === el.indicator);
                    const val = indicatorIndex === -1 ? undefined
                      : year !== -1 && !showMostRecentData ? d.indicators[indicatorIndex].yearlyData[d.indicators[indicatorIndex].yearlyData.findIndex((el) => el.year === year)]?.value
                        : d.indicators[indicatorIndex].yearlyData[d.indicators[indicatorIndex].yearlyData.length - 1]?.value;
                    const color = val !== undefined ? colorScale(xIndicatorMetaData.IsCategorical ? Math.floor(val) : val) : COLOR_SCALES.Null;

                    const regionOpacity = selectedRegions.length === 0 || selectedRegions.indexOf(d['Group 2']) !== -1;
                    const incomeGroupOpacity = selectedIncomeGroups.length === 0 || selectedIncomeGroups.indexOf(d['Income group']) !== -1;
                    const countryOpacity = selectedCountries.length === 0 || selectedCountries.indexOf(d['Country or Area']) !== -1;
                    const countryGroupOpacity = selectedCountryGroup === 'All' ? true : d[selectedCountryGroup];
                    const selectedColorOpacity = !selectedColor || selectedColor === color;

                    return (
                      <circle
                        key={i}
                        cx={center[0]}
                        cy={center[1]}
                        r={sizeVal !== undefined ? radiusScale(sizeVal) : 0}
                        stroke='#212121'
                        strokeWidth={1}
                        fill='none'
                        opacity={regionOpacity && incomeGroupOpacity && countryOpacity && countryGroupOpacity && selectedColorOpacity ? 1 : 0.1}
                      />
                    );
                  })
                }
              </>
            ) : null
          }
        </g>
      </svg>
      <LegendEl>
        {
          sizeIndicator
            ? (
              <>
                <TitleEl>{sizeIndicatorMetaData.IndicatorLabelTable}</TitleEl>
                <svg width='135' height='90' viewBox='0 0 175 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <text fontSize={12} fontWeight={700} textAnchor='middle' fill='#212121' x={4} y={95}>0</text>
                  <text fontSize={12} fontWeight={700} textAnchor='middle' fill='#212121' x={130} y={95}>{format('~s')(radiusScale.invert(40))}</text>
                  <path d='M4 41L130 0V80L4 41Z' fill='#E9ECF6' />
                  <circle cx='4' cy='41' r='0.25' fill='white' stroke='#212121' strokeWidth='2' />
                  <circle cx='130' cy='41' r='40' fill='white' stroke='#212121' strokeWidth='2' />
                </svg>
              </>
            )
            : null
        }
        <TitleEl>{xIndicatorMetaData.IndicatorLabelTable}</TitleEl>
        <svg width='100%' viewBox={`0 0 ${320} ${30}`}>
          <g>
            {
              valueArray.map((d, i) => (
                <g
                  key={i}
                  onMouseOver={() => { setSelectedColor(colorArray[i]); }}
                  onMouseLeave={() => { setSelectedColor(undefined); }}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={xIndicatorMetaData.IsCategorical ? (i * 320) / valueArray.length + 1 : (i * 320) / colorArray.length + 1}
                    y={1}
                    width={xIndicatorMetaData.IsCategorical ? (320 / valueArray.length) - 2 : (320 / colorArray.length) - 2}
                    height={8}
                    fill={colorArray[i]}
                    stroke={selectedColor === colorArray[i] ? '#212121' : colorArray[i]}
                  />
                  <text
                    x={xIndicatorMetaData.IsCategorical ? ((i * 320) / valueArray.length) + (160 / valueArray.length) : ((i + 1) * 320) / colorArray.length}
                    y={25}
                    textAnchor='middle'
                    fontSize={12}
                    fill='#212121'
                  >
                    {format('~s')(d)}
                  </text>
                </g>
              ))
            }
            {
              xIndicatorMetaData.IsCategorical ? null
                : (
                  <g>
                    <rect
                      onMouseOver={() => { setSelectedColor(colorArray[valueArray.length]); }}
                      onMouseLeave={() => { setSelectedColor(undefined); }}
                      x={((valueArray.length * 320) / colorArray.length) + 1}
                      y={1}
                      width={(320 / colorArray.length) - 2}
                      height={8}
                      fill={colorArray[valueArray.length]}
                      stroke={selectedColor === colorArray[valueArray.length] ? '#212121' : colorArray[valueArray.length]}
                      strokeWidth={1}
                      style={{ cursor: 'pointer' }}
                    />
                  </g>
                )
            }
          </g>
        </svg>
      </LegendEl>
      {
        hoverData ? <Tooltip data={hoverData} /> : null
      }
    </El>
  );
};
