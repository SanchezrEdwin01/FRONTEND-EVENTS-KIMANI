import React from 'react';
import ReactSelect, { Props as ReactSelectProps } from 'react-select';
import styles from './index.module.css';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps
  extends Omit<ReactSelectProps<SelectOption, false>, 'value'> {
  label?: string;
  description?: string;
  value?: SelectOption['value'];
  labelPosition?: 'left' | 'right' | 'top';
  wrapperClassName?: string;
  error?: string;
  isCreatable?: boolean;
  backgroundColor?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  description,
  options = [],
  value,
  labelPosition = 'top',
  isDisabled,
  className = '',
  wrapperClassName = '',
  id,
  onChange,
  error,
  placeholder = 'Select an option',
  isCreatable = false,
  backgroundColor = '#2E2C2C',
  adjustHeight = false,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const wrapperClasses = `
    ${styles.selectWrapper}
    ${styles[`label-${labelPosition}`]}
    ${wrapperClassName}
    ${isDisabled ? styles.disabled : ''}
    ${error ? styles.error : ''}
  `;

  const labelContent = label && (
    <div className={styles.labelContent}>
      <span className={styles.labelText}>{label}</span>
      {description && <span className={styles.description}>{description}</span>}
    </div>
  );

  const selectedOption = options.find(option => option.value === value);

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: '40px',
      backgroundColor: backgroundColor,
      border: `1px solid ${error ? 'var(--select-error-color)' : state.isFocused ? 'var(--select-primary-color)' : 'var(--select-border-color)'}`,
      borderRadius: '8px',
      padding: '7px 6px 7px 0',
      boxShadow: 'none',
      '&:hover': {
        borderColor: state.isFocused
          ? 'var(--select-primary-color)'
          : 'var(--select-border-color)'
      },
      height: adjustHeight ? '30px' : 'auto'
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#ffffff',
      fontSize: '16px'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? 'rgba(255, 255, 255, 0.2)'
        : state.isFocused
          ? '#2E2C2C'
          : 'transparent',
      color: '#ffffff',
      borderBottom: '1px solid #2E2C2C',
      '&:last-of-type': {
        borderBottom: 'none'
      },
      '&:active': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)'
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#ffffff'
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#212020',
      zIndex: 10
    }),
    input: (base: any) => ({
      ...base,
      color: '#ffffff'
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: '#ffffff',
      padding: '0px',
      '& svg': {
        width: '30px',
        height: '30px'
      }
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    clearIndicator: (base: any) => ({
      ...base,
      color: '#ffffff',
      padding: '0px'
    })
  };

  const handleChange = (option: any) => {
    if (onChange) {
      if (option && option.__isNew__) {
        const newOption = {
          value: option.value,
          label: option.label
        };

        onChange({
          target: {
            value: newOption.value
          }
        } as any);
      } else {
        onChange({
          target: {
            value: (option as SelectOption)?.value
          }
        } as any);
      }
    }
  };

  const selectProps = isCreatable
    ? {
        ...props,

        isClearable: true,
        isSearchable: true,

        formatCreateLabel: (inputValue: string) => `Add "${inputValue}"`,
        onCreateOption: (inputValue: string) => {
          handleChange({
            __isNew__: true,
            value: inputValue,
            label: inputValue
          });
        }
      }
    : props;

  return (
    <div className={wrapperClasses}>
      {labelContent}
      <div className={styles.selectContainer}>
        <ReactSelect
          id={selectId}
          value={selectedOption}
          isDisabled={isDisabled}
          className={className}
          options={options}
          onChange={handleChange}
          placeholder={placeholder}
          styles={customStyles}
          {...selectProps}
        />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Select;
