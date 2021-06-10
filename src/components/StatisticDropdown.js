import {TABLE_STATISTICS_ALL, STATISTIC_CONFIGS} from '../constants';
import {capitalize} from '../utils/commonFunctions';

import equal from 'fast-deep-equal';
import {memo, useEffect, useCallback, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';

const StatisticDropdown = ({
  currentStatistic,
  isPerLakh,
  delta7Mode,
  mapStatistic,
  setMapStatistic,
  isDistrictView,
  hideDistrictTestData,
  hideVaccinated,
  zoneColor,
}) => {
  const {t} = useTranslation();
  const selectRef = useRef();

  const currentStatisticConfig = STATISTIC_CONFIGS[currentStatistic];

  const statistics = useMemo(() => {
    const filteredStatistics = TABLE_STATISTICS_ALL.filter(
      (statistic) =>
        (!isDistrictView ||
          STATISTIC_CONFIGS[statistic]?.category !== 'tested' ||
          !hideDistrictTestData) &&
        (STATISTIC_CONFIGS[statistic]?.category !== 'vaccinated' ||
          !hideVaccinated)
    );
    return filteredStatistics.includes(currentStatistic)
      ? filteredStatistics
      : [currentStatistic, ...filteredStatistics];
  }, [currentStatistic, isDistrictView, hideDistrictTestData, hideVaccinated]);

  const handleChange = useCallback(
    (event) => {
      setMapStatistic(event.target.value);
    },
    [setMapStatistic]
  );

  useEffect(() => {
    const tempSelect = document.createElement('select');
    const tempOption = document.createElement('option');

    tempOption.textContent = STATISTIC_CONFIGS[mapStatistic]?.displayName;
    tempSelect.style.cssText += `
      visibility: hidden;
      position: fixed;
      `;
    tempSelect.appendChild(tempOption);
    selectRef.current.after(tempSelect);

    const tempSelectWidth = tempSelect.getBoundingClientRect().width;
    if (tempSelectWidth > 0) {
      selectRef.current.style.width = `${tempSelectWidth + 2}px`;
    }
    tempSelect.remove();
  }, [mapStatistic]);

  const statisticColor = zoneColor || currentStatisticConfig?.color;

  return (
    <div className="StatisticDropdown">
      <select
        ref={selectRef}
        value={currentStatistic}
        className={currentStatistic}
        style={{
          color: statisticColor,
          background: statisticColor + '20',
          outlineColor: statisticColor + '40',
        }}
        onChange={handleChange}
      >
        {statistics.map((statistic) => {
          const statisticConfig = STATISTIC_CONFIGS[statistic];
          return (
            <option key={statistic} value={statistic}>
              {t(capitalize(statisticConfig?.displayName))}
            </option>
          );
        })}
      </select>
      <span>{`${
        isPerLakh &&
        !currentStatisticConfig?.nonLinear &&
        mapStatistic !== 'population'
          ? ` ${t('per lakh')}`
          : ''
      }${
        (delta7Mode && currentStatisticConfig?.showDelta) ||
        currentStatisticConfig?.tableConfig?.type === 'delta7'
          ? ` ${t('in last 7 days')}`
          : ''
      }`}</span>
    </div>
  );
};

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.currentStatistic, currProps.currentStatistic)) {
    return false;
  } else if (!equal(prevProps.isPerLakh, currProps.isPerLakh)) {
    return false;
  } else if (!equal(prevProps.delta7Mode, currProps.delta7Mode)) {
    return false;
  } else if (!equal(prevProps.mapStatistic, currProps.mapStatistic)) {
    return false;
  } else if (!equal(prevProps.isDistrictView, currProps.isDistrictView)) {
    return false;
  } else if (
    !equal(prevProps.hideDistrictTestData, currProps.hideDistrictTestData)
  ) {
    return false;
  } else if (!equal(prevProps.hideVaccinated, currProps.hideVaccinated)) {
    return false;
  } else if (!equal(prevProps.zoneColor, currProps.zoneColor)) {
    return false;
  }
  return true;
};

export default memo(StatisticDropdown, isEqual);
