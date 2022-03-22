import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Select, Radio, Checkbox } from 'antd';
import domtoimage from 'dom-to-image';
import { CtxDataType, IndicatorMetaDataType } from '../Types';
import Context from '../Context/Context';
import { DEFAULT_VALUES, INCOME_GROUPS } from '../Constants';
import {
  ChevronDown, ChevronLeft,
} from '../Icons';

interface Props {
  indicators: IndicatorMetaDataType[];
  regions: string[];
  countries: string[];
}

const El = styled.div`
  width: 25%;
  box-shadow: var(--shadow-right);
  height: 74rem;
  padding: 2rem;
  border-right: 1px solid var(--black-400);
  overflow: auto;
  @media (max-width: 960px) {
    width: 100%;
    box-shadow: var(--shadow-bottom);
    border-right: 0px solid var(--black-400);
    padding-bottom: 0;
    height: auto;
  }  
`;

const DropdownEl = styled.div`
  margin: 2rem 0;
  &:first-of-type{
    margin-top: 0;
  }
`;

const DropdownTitle = styled.div`
  font-size: 1.4rem;
  color: var(--black-700);
  margin-bottom: 1rem;
  line-height: 1.8rem;
`;

const FiltersEl = styled.div`
  padding: 1rem 0 0 0;
  border-top: 1px solid var(--black-400);
  @media (max-width: 960px) {
    padding: 2rem 0;
  }  
`;

const FilterTitle = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-left: -5px;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const CheckboxEl = styled.div`
  margin: 1rem 0;
  @media (max-width: 960px) {
    margin: 0 0.5rem;
  }  
`;

const ButtonEl = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 1rem 0 2rem 0;
  button {
    margin: 0.5rem 1rem 0.5rem 0;
  }
`;

const CheckboxContainer = styled.div`
  display: inline;
  @media (max-width: 960px) {
    display: flex;
  }  
`;

const AccordionIconEl = styled.div`
  display: flex;
`;

export const Settings = (props: Props) => {
  const {
    indicators,
    regions,
    countries,
  } = props;
  const {
    graphType,
    xAxisIndicator,
    yAxisIndicator,
    showLabel,
    selectedCountryGroup,
    selectedCountries,
    selectedIncomeGroups,
    selectedRegions,
    reverseOrder,
    updateSelectedCountryGroup,
    updateColorIndicator,
    updateXAxisIndicator,
    updateYAxisIndicator,
    updateSizeIndicator,
    updateSelectedRegions,
    updateSelectedCountries,
    updateSelectedIncomeGroups,
    updateShowLabel,
    updateShowSource,
    updateReverseOrder,
    verticalBarLayout,
    updateBarLayout,
  } = useContext(Context) as CtxDataType;
  const options = graphType === 'scatterPlot'
    ? indicators.filter((d) => d.ScatterPlot && d.Themes === '').map((d) => d.Indicator)
    : graphType === 'map'
      ? indicators.filter((d) => d.Map && d.Themes === '').map((d) => d.Indicator)
      : indicators.filter((d) => d.BarGraph && d.Themes === '').map((d) => d.Indicator);
  const sizeOptions = indicators.filter((d) => d.Sizing && d.Themes === '').map((d) => d.Indicator);
  const colorOptions = indicators.filter((d) => d.IsCategorical && d.Themes === '').map((d) => d.Indicator);
  colorOptions.unshift('Human development index (HDI)');
  colorOptions.unshift('Income Groups');
  colorOptions.unshift('Continents');
  const optionsAcc = graphType === 'scatterPlot'
    ? indicators.filter((d) => d.ScatterPlot && d.Themes === 'Accessibility').map((d) => d.Indicator)
    : graphType === 'map'
      ? indicators.filter((d) => d.Map && d.Themes === 'Accessibility').map((d) => d.Indicator)
      : indicators.filter((d) => d.BarGraph && d.Themes === 'Accessibility').map((d) => d.Indicator);
  const sizeOptionsAcc = indicators.filter((d) => d.Sizing && d.Themes === 'Accessibility').map((d) => d.Indicator);
  const colorOptionsAcc = indicators.filter((d) => d.IsCategorical && d.Themes === 'Accessibility').map((d) => d.Indicator);
  const optionsAfor = graphType === 'scatterPlot'
    ? indicators.filter((d) => d.ScatterPlot && d.Themes === 'Affordability').map((d) => d.Indicator)
    : graphType === 'map'
      ? indicators.filter((d) => d.Map && d.Themes === 'Affordability').map((d) => d.Indicator)
      : indicators.filter((d) => d.BarGraph && d.Themes === 'Affordability').map((d) => d.Indicator);
  const sizeOptionsAfor = indicators.filter((d) => d.Sizing && d.Themes === 'Affordability').map((d) => d.Indicator);
  const colorOptionsAfor = indicators.filter((d) => d.IsCategorical && d.Themes === 'Affordability').map((d) => d.Indicator);
  const [settingExpanded, setSettingsExpanded] = useState(true);
  const [filterExpanded, setFilterExpanded] = useState(true);
  useEffect(() => {
    const opts = graphType === 'scatterPlot'
      ? indicators.filter((d) => d.ScatterPlot).map((d) => d.Indicator)
      : graphType === 'map'
        ? indicators.filter((d) => d.Map).map((d) => d.Indicator)
        : indicators.filter((d) => d.BarGraph).map((d) => d.Indicator);
    if (opts.findIndex((d) => d === xAxisIndicator) === -1) {
      updateXAxisIndicator(options[0]);
    }
    if (opts.findIndex((d) => d === yAxisIndicator) === -1 && (graphType === 'scatterPlot')) {
      updateYAxisIndicator(options[0]);
    }
  }, [graphType]);
  return (
    <El>
      <DropdownEl>
        <DropdownTitle>
          {
            graphType === 'scatterPlot'
              ? 'X-Axis'
              : graphType === 'map'
                ? 'Indicator to color region'
                : 'Indicator'
          }
        </DropdownTitle>
        <Select
          showSearch
          style={
            {
              width: '100%',
              borderRadius: '1rem',
            }
          }
          placeholder='Please select'
          value={xAxisIndicator}
          onChange={(d) => { updateXAxisIndicator(d); }}
          listHeight={400}
        >
          <Select.OptGroup label='Accessibility'>
            {
              optionsAcc.map((d) => (
                <Select.Option key={d}>{d}</Select.Option>
              ))
            }
          </Select.OptGroup>
          <Select.OptGroup label='Affordability'>
            {
              optionsAfor.map((d) => (
                <Select.Option key={d}>{d}</Select.Option>
              ))
            }
          </Select.OptGroup>
          <Select.OptGroup label='Common'>
            {
              options.map((d) => (
                <Select.Option key={d}>{d}</Select.Option>
              ))
            }
          </Select.OptGroup>
        </Select>
      </DropdownEl>
      {
        graphType === 'scatterPlot'
          ? (
            <DropdownEl>
              <DropdownTitle>
                Y-Axis
              </DropdownTitle>
              <Select
                showSearch
                style={{ width: '100%' }}
                value={yAxisIndicator}
                placeholder='Please select'
                onChange={(d) => { updateYAxisIndicator(d); }}
                defaultValue={DEFAULT_VALUES.secondMetric}
                listHeight={400}
              >
                <Select.OptGroup label='Accessibility'>
                  {
                    optionsAcc.map((d) => (
                      <Select.Option key={d}>{d}</Select.Option>
                    ))
                  }
                </Select.OptGroup>
                <Select.OptGroup label='Affordability'>
                  {
                    optionsAfor.map((d) => (
                      <Select.Option key={d}>{d}</Select.Option>
                    ))
                  }
                </Select.OptGroup>
                <Select.OptGroup label='Common'>
                  {
                    options.map((d) => (
                      <Select.Option key={d}>{d}</Select.Option>
                    ))
                  }
                </Select.OptGroup>
              </Select>
            </DropdownEl>
          ) : graphType === 'map' ? (
            <DropdownEl>
              <DropdownTitle>
                Secondary Indicator
              </DropdownTitle>
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                value={yAxisIndicator}
                placeholder='Please select'
                onChange={(d) => { updateYAxisIndicator(d); }}
                defaultValue={DEFAULT_VALUES.secondMetric}
                listHeight={400}
              >
                <Select.OptGroup label='Accessibility'>
                  {
                    optionsAcc.map((d) => (
                      <Select.Option key={d}>{d}</Select.Option>
                    ))
                  }
                </Select.OptGroup>
                <Select.OptGroup label='Affordability'>
                  {
                    optionsAfor.map((d) => (
                      <Select.Option key={d}>{d}</Select.Option>
                    ))
                  }
                </Select.OptGroup>
                <Select.OptGroup label='Common'>
                  {
                    options.map((d) => (
                      <Select.Option key={d}>{d}</Select.Option>
                    ))
                  }
                </Select.OptGroup>
              </Select>
            </DropdownEl>
          ) : null
      }
      {
        graphType === 'map' || graphType === 'scatterPlot' ? (
          <DropdownEl>
            <DropdownTitle>
              Size By
            </DropdownTitle>
            <Select
              allowClear
              showSearch
              style={{ width: '100%' }}
              placeholder='Size By'
              onChange={(d) => { updateSizeIndicator(d); }}
              listHeight={400}
            >
              <Select.OptGroup label='Accessibility'>
                {
                  sizeOptionsAcc.map((d) => (
                    <Select.Option key={d}>{d}</Select.Option>
                  ))
                }
              </Select.OptGroup>
              <Select.OptGroup label='Affordability'>
                {
                  sizeOptionsAfor.map((d) => (
                    <Select.Option key={d}>{d}</Select.Option>
                  ))
                }
              </Select.OptGroup>
              <Select.OptGroup label='Common'>
                {
                  sizeOptions.map((d) => (
                    <Select.Option key={d}>{d}</Select.Option>
                  ))
                }
              </Select.OptGroup>
            </Select>
          </DropdownEl>
        ) : null
      }
      {
        graphType === 'barGraph' || graphType === 'scatterPlot' ? (
          <DropdownEl>
            <DropdownTitle>
              Color By
            </DropdownTitle>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder='Color By'
              onChange={(d) => { updateColorIndicator(d); }}
              defaultValue={DEFAULT_VALUES.colorMetric}
            >
              <Select.OptGroup label='Accessibility'>
                {
                  colorOptionsAcc.map((d) => (
                    <Select.Option key={d}>{d}</Select.Option>
                  ))
                }
              </Select.OptGroup>
              <Select.OptGroup label='Affordability'>
                {
                  colorOptionsAfor.map((d) => (
                    <Select.Option key={d}>{d}</Select.Option>
                  ))
                }
              </Select.OptGroup>
              <Select.OptGroup label='Common'>
                {
                  colorOptions.map((d) => (
                    <Select.Option key={d}>{d}</Select.Option>
                  ))
                }
              </Select.OptGroup>
            </Select>
          </DropdownEl>
        ) : null
      }
      <ButtonEl>
        <button className='primary' type='button' onClick={() => { updateShowSource(true); }}>Data Description & Download</button>
        <button
          className={graphType === 'barGraph' && verticalBarLayout ? 'disabled primary' : 'primary'}
          type='button'
          disabled={!(graphType === 'barGraph' && verticalBarLayout)}
          onClick={() => {
            // tslint:disable-next-line: no-floating-promises
            domtoimage
              .toPng(document.getElementById('graph-node') as HTMLElement)
              .then((dataUrl: any) => {
                const link = document.createElement('a');
                link.download = 'graph.png';
                link.href = dataUrl;
                link.click();
              });
          }}
        >
          Download Graph
        </button>
      </ButtonEl>
      {
        graphType !== 'map' ? (
          <FiltersEl>
            <FilterTitle onClick={() => { setSettingsExpanded(!settingExpanded); }}>
              <AccordionIconEl>
                {
                  settingExpanded
                    ? <ChevronDown fill='#212121' size={20} /> : <ChevronLeft fill='#212121' size={20} />
                }
              </AccordionIconEl>
              <div style={{ marginTop: '2px' }}>
                Settings
                {' '}
                &
                {' '}
                Options
              </div>
            </FilterTitle>
            <div style={{ display: settingExpanded ? 'inline' : 'none' }}>
              <CheckboxContainer>
                {
                  graphType === 'scatterPlot'
                    ? (
                      <CheckboxEl>
                        <Checkbox checked={showLabel} onChange={(e) => { updateShowLabel(e.target.checked); }}>Show Label</Checkbox>
                      </CheckboxEl>
                    )
                    : null
                }
                {
                  graphType === 'barGraph'
                    ? (
                      <>
                        <CheckboxEl>
                          <Checkbox checked={!verticalBarLayout} onChange={(e) => { updateBarLayout(!e.target.checked); }}>Show Horizontal</Checkbox>
                        </CheckboxEl>
                        <CheckboxEl>
                          <Checkbox disabled={!verticalBarLayout} checked={reverseOrder} onChange={(e) => { updateReverseOrder(e.target.checked); }}>Show Largest First</Checkbox>
                        </CheckboxEl>
                      </>
                    )
                    : null
                }
              </CheckboxContainer>
            </div>
          </FiltersEl>
        )
          : null
      }
      <FiltersEl>
        <FilterTitle onClick={() => { setFilterExpanded(!filterExpanded); }}>
          <AccordionIconEl>
            {
                    filterExpanded
                      ? <ChevronDown fill='#212121' size={20} /> : <ChevronLeft fill='#212121' size={20} />
                  }
          </AccordionIconEl>
          <div style={{ marginTop: '2px' }}>
            Filter or Highlight By
          </div>
        </FilterTitle>
        <div style={{ display: filterExpanded ? 'inline' : 'none' }}>
          <DropdownEl>
            <DropdownTitle>
              Region
            </DropdownTitle>
            <Select
              mode='multiple'
              allowClear
              style={{ width: '100%' }}
              placeholder='Filter By Regions'
              value={selectedRegions}
              onChange={(d: string[]) => { updateSelectedRegions(d); }}
            >
              {
                    regions.map((d) => (
                      <Select.Option key={d}>{d}</Select.Option>
                    ))
                  }
            </Select>
          </DropdownEl>
          <DropdownEl>
            <DropdownTitle>
              Income Group
            </DropdownTitle>
            <Select
              mode='multiple'
              allowClear
              style={{ width: '100%' }}
              placeholder='Filter By Income Group'
              value={selectedIncomeGroups}
              onChange={(d: string[]) => { updateSelectedIncomeGroups(d); }}
            >
              {
                    INCOME_GROUPS.map((d) => (
                      <Select.Option key={d}>{d}</Select.Option>
                    ))
                  }
            </Select>
          </DropdownEl>
          <DropdownEl>
            <DropdownTitle>
              Country Groups
            </DropdownTitle>
            <Radio.Group onChange={(d) => { updateSelectedCountryGroup(d.target.value); }} value={selectedCountryGroup} buttonStyle='solid' size='small'>
              <Radio.Button value='All'>All</Radio.Button>
              <Radio.Button value='LDC'>LDC</Radio.Button>
              <Radio.Button value='LLDC'>LLDC</Radio.Button>
              <Radio.Button value='SIDS'>SIDS</Radio.Button>
            </Radio.Group>
          </DropdownEl>
          <DropdownEl>
            <DropdownTitle>
              Countries
            </DropdownTitle>
            <Select
              mode='multiple'
              allowClear
              style={{ width: '100%' }}
              value={selectedCountries}
              placeholder='Filter By Countries'
              onChange={(d: string[]) => { updateSelectedCountries(d); }}
            >
              {
                      countries.map((d) => (
                        <Select.Option key={d}>{d}</Select.Option>
                      ))
                    }
            </Select>
          </DropdownEl>
        </div>
      </FiltersEl>
    </El>
  );
};
