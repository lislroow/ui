import React from 'react';

export interface SelectProps {
  size?: 'sm' | 'lg' | 'full';
  name?: string;
  items: SelectItem[];
  onClick?: () => void;
  className?: string;
  isDisabled?: boolean;
  useFirstItem?: boolean;
  onChange?: (e: any) => void;
  value?: any;
  tabIndex?: number;
}

export interface SelectItem {
  label: string;
  value: string;
}

const FormSelect: React.FC<SelectProps> = ({
  size = 'sm',
  name,
  items = [],
  className,
  isDisabled = false,
  useFirstItem = false,
  tabIndex = 1006,
  ...props
}: SelectProps) => {
  return (
    <>
      <select
        tabIndex={tabIndex}
        className={`select select--${size} ${className}`}
        name={name}
        disabled={isDisabled}
        {...props}
      >
        {items.length > 0 &&
          items.map((item, idx) => {
            return idx === 0 && useFirstItem ? (
              <option
                key={`form-select-${idx}`}
                className={`option`}
                value={item.value}
                disabled
                hidden
              >
                {item.label}
              </option>
            ) : (
              <option key={`form-select-${idx}`} className={`option`} value={item.value}>
                {item.label}
              </option>
            );
          })}
      </select>
      <style jsx>{`
        .select {
          border: 1px solid #dbdbdb;
          border-radius: 3px;
          padding-left: 10.5px;
          padding-right: 20.5px;
          color: #000000;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-repeat: no-repeat;
          background-position-x: 93%;
          background-position-y: 50%;
          font-size: 14px;
          font-weight: 400;
          background-color: #ffffff;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .select:disabled {
          background: #f1f1f1 0% 0% no-repeat padding-box;
          border: 1px solid #dbdbdb;
          cursor: not-allowed;
        }
        .option {
          width: 169px;
          height: 40px;

          background: #ffffff 0% 0% no-repeat padding-box;
          border-radius: 3px;
          opacity: 1;
        }
        .select--sm {
          width: 176px;
          height: 30px;
        }
        .select--lg {
          width: 300px;
          height: 30px;
        }
        .select--full {
          width: 100%;
          height: 30px;
        }
      `}</style>
    </>
  );
};

export default FormSelect;
