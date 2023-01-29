import {
  useContext, useState,
} from 'react';
import styled from 'styled-components';
import { format } from 'd3-format';
import maxBy from 'lodash.maxby';
import orderBy from 'lodash.orderby';
import { Delaunay } from 'd3-delaunay';
import {
  scaleOrdinal, scaleLinear, scaleThreshold, scaleSqrt,
} from 'd3-scale';
import minBy from 'lodash.minby';
import { Tooltip } from '../Components/Tooltip';
import {
  CtxDataType, DataType, HoverDataType, HoverRowDataType, IndicatorMetaDataType,
} from '../Types';
import Context from '../Context/Context';
import {
  COLOR_SCALES, CONTINENTS, HDI_LEVELS, INCOME_GROUPS, LABEL_EXTRA, MAX_TEXT_LENGTH, TRUNCATE_MAX_TEXT_LENGTH,
} from '../Constants';

interface Props {
  data: DataType[];
  indicators: IndicatorMetaDataType[];
}

const El = styled.div`
  height: 100%;
  overflow-y: hidden;
`;

export const ScatterPlot = (props: Props) => {
  const {
    data,
    indicators,
  } = props;
  const {
    xAxisIndicator,
    yAxisIndicator,
    showLabel,
    sizeIndicator,
    colorIndicator,
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
  const margin = {
    top: 90,
    bottom: 50,
    left: 90,
    right: 20,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;
  const xIndicatorMetaData = indicators[indicators.findIndex((indicator) => indicator.Indicator === xAxisIndicator)];
  const yIndicatorMetaData = indicators[indicators.findIndex((indicator) => indicator.Indicator === yAxisIndicator)];
  const sizeIndicatorMetaData = indicators[indicators.findIndex((indicator) => indicator.Indicator === sizeIndicator)];
  const colorIndicatorMetaData = indicators[indicators.findIndex((indicator) => indicator.Indicator === colorIndicator)];
  const sizeMax = sizeIndicatorMetaData ? maxBy(data, (d) => d.data[d.data.findIndex((el) => el.indicator === sizeIndicatorMetaData.DataKey)]?.value) : undefined;
  const radiusScale = sizeIndicatorMetaData && sizeMax ? scaleSqrt().domain([0, sizeMax.data[sizeMax.data.findIndex((el) => el.indicator === sizeIndicatorMetaData.DataKey)].value as number]).range([0.25, 30]).nice() : undefined;

  const dataFormatted = orderBy(
    data.map((d) => {
      const xIndicatorIndex = d.data.findIndex((el) => xIndicatorMetaData.DataKey === el.indicator);
      const yIndicatorIndex = d.data.findIndex((el) => yIndicatorMetaData.DataKey === el.indicator);
      const colorIndicatorIndex = d.data.findIndex((el) => colorIndicatorMetaData?.DataKey === el.indicator);
      const radiusIndicatorIndex = radiusScale ? d.data.findIndex((el) => sizeIndicatorMetaData?.DataKey === el.indicator) : -1;
      const radiusValue = !radiusScale ? 5 : radiusIndicatorIndex === -1 ? undefined : d.data[radiusIndicatorIndex].value;
      const radiusIndicatorLabelExtraIndex = LABEL_EXTRA.findIndex((el) => el.forLabel === sizeIndicatorMetaData?.DataKey) === -1 || radiusIndicatorIndex === -1 ? -1 : d.data.findIndex((el) => LABEL_EXTRA[LABEL_EXTRA.findIndex((el1) => el1.forLabel === sizeIndicatorMetaData?.DataKey)].labelExtra === el.indicator);
      const radiusLabelExtra = radiusIndicatorLabelExtraIndex === -1 ? undefined : d.data[radiusIndicatorLabelExtraIndex].value;
      const xVal = xIndicatorIndex === -1 ? undefined : d.data[xIndicatorIndex].value;
      const xIndicatorLabelExtraIndex = LABEL_EXTRA.findIndex((el) => el.forLabel === xIndicatorMetaData.DataKey) === -1 || xIndicatorIndex === -1 ? -1 : d.data.findIndex((el) => LABEL_EXTRA[LABEL_EXTRA.findIndex((el1) => el1.forLabel === xIndicatorMetaData.DataKey)].labelExtra === el.indicator);
      const xLabelExtra = xIndicatorLabelExtraIndex === -1 ? undefined : d.data[xIndicatorLabelExtraIndex].value;
      const yVal = yIndicatorIndex === -1 ? undefined : d.data[yIndicatorIndex].value;
      const yIndicatorLabelExtraIndex = LABEL_EXTRA.findIndex((el) => el.forLabel === yIndicatorMetaData.DataKey) === -1 || yIndicatorIndex === -1 ? -1 : d.data.findIndex((el) => LABEL_EXTRA[LABEL_EXTRA.findIndex((el1) => el1.forLabel === yIndicatorMetaData.DataKey)].labelExtra === el.indicator);
      const yLabelExtra = yIndicatorLabelExtraIndex === -1 ? undefined : d.data[yIndicatorLabelExtraIndex].value;
      const colorVal = colorIndicator === 'Continents' ? d['Group 1']
        : colorIndicator === 'Income Groups' ? d['Income group']
          : colorIndicatorIndex === -1 ? undefined
            : d.data[colorIndicatorIndex].value;
      const colorIndicatorLabelExtraIndex = LABEL_EXTRA.findIndex((el) => el.forLabel === colorIndicatorMetaData?.DataKey) === -1 || colorIndicatorIndex === -1 ? -1 : d.data.findIndex((el) => LABEL_EXTRA[LABEL_EXTRA.findIndex((el1) => el1.forLabel === colorIndicatorMetaData?.DataKey)].labelExtra === el.indicator);
      const colorLabelExtra = colorIndicatorLabelExtraIndex === -1 ? undefined : d.data[colorIndicatorLabelExtraIndex].value;
      const countryGroup = selectedCountryGroup === 'All' ? true : d[selectedCountryGroup];
      const region = !!(selectedRegions.length === 0 || selectedRegions.indexOf(d['Group 2']) !== -1);
      return ({
        countryCode: d['Alpha-3 code'],
        radiusValue,
        radiusLabelExtra,
        xVal,
        xLabelExtra,
        yVal,
        yLabelExtra,
        colorVal,
        colorLabelExtra,
        region,
        countryGroup,
      });
    }).filter((d) => d.radiusValue !== undefined && d.xVal !== undefined && d.yVal !== undefined && d.radiusValue !== null && d.xVal !== null && d.yVal !== null && d.countryGroup && d.region), 'radiusValue', 'desc',
  );

  const xMaxValue = maxBy(dataFormatted, (d) => d.xVal) ? maxBy(dataFormatted, (d) => d.xVal)?.xVal as number : 0;
  const xMinValue = minBy(dataFormatted, (d) => d.xVal) ? minBy(dataFormatted, (d) => d.xVal)?.xVal as number : 0;
  const yMaxValue = maxBy(dataFormatted, (d) => d.yVal) ? maxBy(dataFormatted, (d) => d.yVal)?.yVal as number : 0;
  const yMinValue = minBy(dataFormatted, (d) => d.yVal) ? minBy(dataFormatted, (d) => d.yVal)?.yVal as number : 0;

  const xScale = scaleLinear().domain([xMinValue > 0 ? 0 : xMinValue, xMaxValue]).range([0, graphWidth]).nice();
  const yScale = scaleLinear().domain([yMinValue > 0 ? 0 : yMinValue, yMaxValue]).range([graphHeight, 0]).nice();
  const xTicks = xScale.ticks(5);
  const yTicks = yScale.ticks(5);
  const voronoiDiagram = Delaunay
    .from(dataFormatted, (d) => xScale(d.xVal as number), (d) => yScale(d.yVal as number))
    .voronoi([0, 0, graphWidth, graphHeight]);
  let colorList = colorIndicator === 'Income Groups' ? COLOR_SCALES.Divergent.Color4 : COLOR_SCALES.Categorical;

  if (colorIndicatorMetaData?.IsCategorical) {
    switch (colorIndicatorMetaData?.Categories.length) {
      case 5:
        colorList = COLOR_SCALES.Linear.RedColor5;
        break;
      case 6:
        colorList = COLOR_SCALES.Linear.RedColor6;
        break;
      case 7:
        colorList = COLOR_SCALES.Linear.RedColor7;
        break;
      case 8:
        colorList = COLOR_SCALES.Linear.RedColor8;
        break;
      case 9:
        colorList = COLOR_SCALES.Linear.RedColor9;
        break;
      default:
        colorList = COLOR_SCALES.Linear.RedColor10;
        break;
    }
  }

  if (colorIndicatorMetaData?.IsDivergent) {
    switch (colorIndicatorMetaData?.Categories.length) {
      case 4:
        colorList = COLOR_SCALES.Divergent.Color4;
        break;
      case 5:
        colorList = COLOR_SCALES.Divergent.Color5;
        break;
      case 7:
        colorList = COLOR_SCALES.Divergent.Color7;
        break;
      case 9:
        colorList = COLOR_SCALES.Divergent.Color9;
        break;
      default:
        colorList = COLOR_SCALES.Divergent.Color11;
        break;
    }
  }
  const colorDomain = colorIndicator === 'Continents' ? CONTINENTS
    : colorIndicator === 'Income Groups' ? INCOME_GROUPS
      : colorIndicator === 'Human development index (HDI)' ? [0.55, 0.7, 0.8]
        : colorIndicatorMetaData?.Categories ? colorIndicatorMetaData?.Categories
          : [0, 0];

  const colorScale = colorIndicator === 'Human development index (HDI)' ? scaleThreshold<string | number, string>().domain(colorDomain).range(COLOR_SCALES.Divergent.Color4).unknown('#666') : scaleOrdinal<string | number, string>().domain(colorDomain).range(colorList).unknown('#666');

  return (
    <El>
      <svg width='100%' height='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <g
          transform='translate(90,20)'
        >
          <text
            x={0}
            y={10}
            fontSize={14}
            fill='#212121'
          >
            {colorIndicatorMetaData?.Indicator ? colorIndicatorMetaData?.Indicator : colorIndicator}
          </text>
          {
            colorIndicator === 'Human development index (HDI)' ? COLOR_SCALES.Divergent.Color4.map((d, i) => (
              <g
                transform='translate(0,20)'
                key={i}
                onMouseOver={() => { setSelectedColor(d); }}
                onMouseLeave={() => { setSelectedColor(undefined); }}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={(i * (graphWidth - 50)) / COLOR_SCALES.Divergent.Color4.length + 1}
                  y={1}
                  width={((graphWidth - 50) / COLOR_SCALES.Divergent.Color4.length) - 2}
                  height={8}
                  fill={d}
                  stroke={selectedColor === d ? '#212121' : d}
                />
                <text
                  x={((i * (graphWidth - 50)) / COLOR_SCALES.Divergent.Color4.length) + (((graphWidth - 50) / 2) / COLOR_SCALES.Divergent.Color4.length)}
                  y={25}
                  textAnchor='middle'
                  fontSize={12}
                  fill='#212121'
                >
                  {HDI_LEVELS[i]}
                </text>
              </g>
            )) : colorDomain.map((d, i) => (
              <g
                transform='translate(0,20)'
                key={i}
                onMouseOver={() => { setSelectedColor(colorList[i]); }}
                onMouseLeave={() => { setSelectedColor(undefined); }}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={(i * (graphWidth - 50)) / colorDomain.length + 1}
                  y={1}
                  width={((graphWidth - 50) / colorDomain.length) - 2}
                  height={8}
                  fill={colorList[i]}
                  stroke={selectedColor === colorList[i] ? '#212121' : colorList[i]}
                />
                <text
                  x={((i * (graphWidth - 50)) / colorDomain.length) + (((graphWidth - 50) / 2) / colorDomain.length)}
                  y={25}
                  textAnchor='middle'
                  fontSize={12}
                  fill='#212121'
                >
                  {d}
                </text>
              </g>
            ))
          }
          <g
            transform='translate(0,20)'
          >
            <rect
              x={graphWidth - 40}
              y={1}
              width={40}
              height={8}
              fill='#666'
              stroke='#666'
            />
            <text
              x={graphWidth - 20}
              y={25}
              textAnchor='middle'
              fontSize={12}
              fill='#666'
            >
              NA
            </text>
          </g>
        </g>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g>
            {
              yTicks.map((d, i) => (
                <g key={i} opacity={d === 0 ? 0 : 1}>
                  <line
                    x1={0}
                    x2={graphWidth}
                    y1={yScale(d)}
                    y2={yScale(d)}
                    stroke='#AAA'
                    strokeWidth={1}
                    strokeDasharray='4,8'
                  />
                  <text
                    x={0}
                    y={yScale(d)}
                    fill='#666'
                    textAnchor='end'
                    fontSize={12}
                    dy={4}
                    dx={-3}
                  >
                    {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                  </text>
                </g>
              ))
            }
            <line
              x1={0}
              x2={graphWidth}
              y1={yScale(0)}
              y2={yScale(0)}
              stroke='#666'
              strokeWidth={1}
            />
            <text
              x={0}
              y={yScale(0)}
              fill='#666'
              textAnchor='end'
              fontSize={12}
              dy={4}
              dx={-3}
            >
              0
            </text>
            <text
              transform={`translate(-50, ${graphHeight / 2}) rotate(-90)`}
              fill='#212121'
              textAnchor='middle'
              fontSize={yIndicatorMetaData.Indicator.length > MAX_TEXT_LENGTH ? 10 : 12}
            >
              {yIndicatorMetaData.Indicator.length > TRUNCATE_MAX_TEXT_LENGTH ? `${yIndicatorMetaData.Indicator.substring(0, TRUNCATE_MAX_TEXT_LENGTH)}...` : yIndicatorMetaData.Indicator}
            </text>
          </g>
          <g>
            {
              xTicks.map((d, i) => (
                <g key={i} opacity={d === 0 ? 0 : 1}>
                  <line
                    y1={0}
                    y2={graphHeight}
                    x1={xScale(d)}
                    x2={xScale(d)}
                    stroke='#AAA'
                    strokeWidth={1}
                    strokeDasharray='4,8'
                  />
                  <text
                    x={xScale(d)}
                    y={graphHeight}
                    fill='#666'
                    textAnchor='middle'
                    fontSize={12}
                    dy={12}
                  >
                    {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                  </text>
                </g>
              ))
            }
            <line
              y1={0}
              y2={graphHeight}
              x1={xScale(0)}
              x2={xScale(0)}
              stroke='#666'
              strokeWidth={1}
            />
            <text
              x={xScale(0)}
              y={graphHeight}
              fill='#666'
              textAnchor='middle'
              fontSize={12}
              dy={15}
            >
              {0}
            </text>
            <text
              transform={`translate(${graphWidth / 2}, ${graphHeight})`}
              fill='#212121'
              textAnchor='middle'
              fontSize={yIndicatorMetaData.Indicator.length > MAX_TEXT_LENGTH ? 10 : 12}
              dy={30}
            >
              {xIndicatorMetaData.Indicator.length > TRUNCATE_MAX_TEXT_LENGTH ? `${xIndicatorMetaData.Indicator.substring(0, TRUNCATE_MAX_TEXT_LENGTH)}...` : xIndicatorMetaData.Indicator}
            </text>
          </g>

          {
            dataFormatted.map((d, i) => {
              const countryData = data[data.findIndex((el) => el['Alpha-3 code'] === d.countryCode)];
              const incomeGroupOpacity = selectedIncomeGroups.length === 0 || selectedIncomeGroups.indexOf(countryData['Income group']) !== -1;
              const countryOpacity = selectedCountries.length === 0 || selectedCountries.indexOf(countryData['Country or Area']) !== -1;
              const selectedColorOpacity = d.colorVal !== undefined && d.colorVal !== null ? !selectedColor || selectedColor === colorScale(d.colorVal) as string : !selectedColor;
              const rowData: HoverRowDataType[] = [
                {
                  title: xAxisIndicator,
                  value: d.xVal !== undefined && d.xVal !== null ? d.xVal : 'NA',
                  labelExtra: d.xLabelExtra,
                  type: 'x-axis',
                  prefix: xIndicatorMetaData?.LabelPrefix,
                  suffix: xIndicatorMetaData?.LabelSuffix,
                },
                {
                  title: yAxisIndicator,
                  value: d.yVal !== undefined && d.yVal !== null ? d.yVal : 'NA',
                  labelExtra: d.yLabelExtra,
                  type: 'y-axis',
                  prefix: yIndicatorMetaData?.LabelPrefix,
                  suffix: yIndicatorMetaData?.LabelSuffix,
                },
              ];
              if (sizeIndicator) {
                rowData.push({
                  title: sizeIndicator,
                  value: d.radiusValue !== undefined && d.radiusValue !== null ? d.radiusValue : 'NA',
                  labelExtra: d.radiusLabelExtra,
                  type: 'size',
                  prefix: sizeIndicatorMetaData?.LabelPrefix,
                  suffix: sizeIndicatorMetaData?.LabelSuffix,
                });
              }
              if (colorIndicator !== 'Continents') {
                rowData.push({
                  title: colorIndicator,
                  value: d.colorVal !== undefined && d.colorVal !== null ? d.colorVal : 'NA',
                  labelExtra: d.colorLabelExtra,
                  type: 'color',
                  color: d.colorVal ? colorScale(d.colorVal) as string : '#666',
                  prefix: colorIndicatorMetaData?.LabelPrefix,
                  suffix: colorIndicatorMetaData?.LabelSuffix,
                });
              }
              if (d.xVal === undefined || d.yVal === undefined || d.radiusValue === undefined || d.xVal === null || d.yVal === null || d.radiusValue === null) return null;
              return (
                <g
                  key={i}
                >
                  <g
                    opacity={
                      !hoverData
                        ? incomeGroupOpacity && countryOpacity && selectedColorOpacity ? 1 : 0.1
                        : hoverData.country === countryData['Country or Area'] ? 1 : 0.1
                      }
                    className={d.countryCode}
                    transform={`translate(${xScale(d.xVal)},${yScale(d.yVal)})`}
                  >
                    <circle
                      cx={0}
                      cy={0}
                      r={!radiusScale ? 5 : radiusScale(d.radiusValue)}
                      fill={d.colorVal ? colorScale(d.colorVal) as string : '#666'}
                      fillOpacity={0.6}
                      stroke={d.colorVal ? colorScale(d.colorVal) as string : '#666'}
                    />
                    {
                      showLabel
                        ? (
                          <text
                            fontSize={10}
                            fill={d.colorVal ? colorScale(d.colorVal) as string : '#666'}
                            y={0}
                            x={!radiusScale ? 5 : radiusScale(d.radiusValue)}
                            dy={4}
                            dx={3}
                          >
                            {countryData['Alpha-3 code']}
                          </text>
                        ) : null
                    }
                  </g>
                  <path
                    d={voronoiDiagram.renderCell(i)}
                    fill='#fff'
                    opacity={0}
                    onMouseEnter={(event) => {
                      setHoverData({
                        country: countryData['Country or Area'],
                        continent: countryData['Group 1'],
                        rows: rowData,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }}
                    onMouseMove={(event) => {
                      setHoverData({
                        country: countryData['Country or Area'],
                        continent: countryData['Group 1'],
                        rows: rowData,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }}
                    onMouseLeave={() => {
                      setHoverData(undefined);
                    }}
                  />
                </g>
              );
            })
          }
        </g>
      </svg>
      {
        hoverData ? <Tooltip data={hoverData} /> : null
      }
    </El>
  );
};
