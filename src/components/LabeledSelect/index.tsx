import React from 'react';
import styles from './index.module.css';
import Select from '@/components/Select';

interface LabeledSelectProps {
  label: string;
  description?: string;
  labelPosition?: 'left' | 'right' | 'top';
  wrapperClassName?: string;
  error?: string;
  name?: string;
  blockGrayLabelToggleField?: boolean;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  adjustHeight?: boolean;
}

const LabeledSelect: React.FC<LabeledSelectProps> = ({
  label,
  description,
  labelPosition = 'left',
  wrapperClassName = '',
  error,
  name,
  blockGrayLabelToggleField = false,
  options,
  value,
  onChange,
  disabled = false,
  placeholder,
  backgroundColor = '#2E2C2C',
  adjustHeight = false
}) => {
  const wrapperClasses = `
    ${styles.wrapper} 
    ${styles[`label-${labelPosition}`]}
    ${wrapperClassName}
    ${disabled ? styles.disabled : ''}
    ${blockGrayLabelToggleField ? styles.blockGrayLabelToggleField : ''}
  `;

  const labelContent = (
    <div className={styles.labelContent}>
      <span className={styles.labelText}>{label}</span>
      {description && <span className={styles.description}>{description}</span>}
    </div>
  );

  return (
    <div className={wrapperClasses}>
      <label className={styles.label}>
        {labelPosition !== 'right' && labelContent}
        <div className={`${labelPosition !== 'right' ? 'ml-auto' : ''}`}>
          <Select
            options={options}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            isSearchable={false}
            value={value}
            error={error}
            wrapperClassName={'h-[30px] mt-[-12px] !p-0'}
            backgroundColor={backgroundColor}
            adjustHeight={adjustHeight}
          />
        </div>
        {labelPosition === 'right' && labelContent}
      </label>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default LabeledSelect;
