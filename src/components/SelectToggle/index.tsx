import React from 'react';
import styles from './index.module.css';

interface SelectToggleProps {
  label: string;
  description?: string;
  labelPosition?: 'left' | 'right' | 'top';
  wrapperClassName?: string;
  error?: string;
  name?: string;
  blockGrayLabelToggleField?: boolean;
  showNumberInput?: boolean;
  numberValue?: number;
  onNumberChange?: (value: number) => void;
  minNumber?: number;
  maxNumber?: number;
  withContent?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
  options: { label: string; value: string }[];
  selectedValue?: string;
  onSelectChange?: (value: string) => void;
  disabled?: boolean;
}

const SelectToggle: React.FC<SelectToggleProps> = ({
  label,
  description,
  labelPosition = 'left',
  disabled = false,
  wrapperClassName = '',
  error,
  name,
  blockGrayLabelToggleField = false,
  showNumberInput = false,
  numberValue = 1,
  onNumberChange,
  minNumber = 1,
  maxNumber = 10,
  withContent = true,
  value,
  onChange,
  options,
  selectedValue,
  onSelectChange
}) => {
  const wrapperClasses = `
    ${styles.toggleWrapper} 
    ${styles[`label-${labelPosition}`]}
    ${wrapperClassName}
    ${disabled ? styles.disabled : ''}
    ${blockGrayLabelToggleField ? styles.blockGrayLabelToggleField : ''}
    ${showNumberInput ? 'min-h-[79px]' : ''}
  `;

  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!value);
    }
  };

  const handleNumberChange = (newValue: number) => {
    if (onNumberChange && newValue >= minNumber && newValue <= maxNumber) {
      onNumberChange(newValue);
    }
  };

  const labelContent = (
    <div className={styles.labelContent}>
      <span className={styles.labelText}>{label}</span>
      {description && <span className={styles.description}>{description}</span>}
    </div>
  );

  const numberInputSection =
    showNumberInput && value ? (
      <div className={styles.numberInputContainer}>
        <button
          type="button"
          className={styles.numberControl}
          onClick={() => handleNumberChange(numberValue - 1)}
          disabled={numberValue <= minNumber || disabled}
        >
          -
        </button>
        <input
          type="number"
          className={styles.numberInput}
          value={numberValue}
          onChange={e =>
            handleNumberChange(parseInt(e.target.value) || minNumber)
          }
          min={minNumber}
          max={maxNumber}
          disabled={disabled}
        />
        <button
          type="button"
          className={styles.numberControl}
          onClick={() => handleNumberChange(numberValue + 1)}
          disabled={numberValue >= maxNumber || disabled}
        >
          +
        </button>
      </div>
    ) : (
      showNumberInput && <div className="h-[29px]"></div>
    );

  return (
    <div className={wrapperClasses}>
      <label className={styles.label}>
        {labelPosition !== 'right' && labelContent}
        <div
          className={`${labelPosition !== 'right' ? 'ml-auto' : ''} flex flex-col gap-1`}
        >
          <div
            className={styles.toggleContainer}
            style={{
              margin: showNumberInput
                ? '2px 0 auto 24px'
                : withContent
                  ? '2px 0 auto auto'
                  : '2px 0 0 0'
            }}
          >
            <input
              type="checkbox"
              checked={value}
              disabled={disabled}
              className={styles.toggleInput}
              onChange={handleToggle}
              name={name}
            />
            <div className={styles.toggleSlider} role="presentation">
              <div className={styles.toggleHandle} />
            </div>
          </div>

          {value && (
            <select
              className="mt-2 bg-[#2E2C2C] text-[#EAEEDD] rounded-lg p-2 border border-[#78788086]"
              value={selectedValue}
              onChange={e => onSelectChange?.(e.target.value)}
              disabled={disabled}
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {numberInputSection}
        </div>
        {labelPosition === 'right' && labelContent}
      </label>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SelectToggle;
