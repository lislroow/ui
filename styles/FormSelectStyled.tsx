import React from 'react';

export interface SelectProps {
  size?: 'sm' | 'me' | 'lg' | 'full';
  name?: string;
  items: SelectItem[];
  onClick?: () => void;
  className?: string;
  isDisabled?: boolean;
  useFirstItem?: boolean;
  onChange?: (e: any) => void;
  value?: any;
  tabIndex?: number;
  textAlign?: 'left' | 'center';
  width?: string;
}

export interface SelectItem {
  label: string;
  value: any;
}

const FormSelect: React.FC<SelectProps> = ({
  size = 'me',
  name,
  items = [],
  className,
  isDisabled = false,
  useFirstItem = false,
  tabIndex = 1000,
  textAlign = 'center',
  width,
  ...props
}: SelectProps) => {
  return (
    <>
      <select
        tabIndex={tabIndex}
        className={`select ${width ? '' : 'select--'+size}`}
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
          padding: 0 10px;
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
          text-align-last: center;
          height: 30px;
          width: ${width};
        }
        .select:disabled {
          background: #f1f1f1 0% 0% no-repeat padding-box;
          border: 1px solid #dbdbdb;
          cursor: not-allowed;
        }
        .option {
          height: 40px;
          background: #ffffff 0% 0% no-repeat padding-box;
          border-radius: 3px;
          opacity: 1;
          text-align: ${textAlign};
        }
        .select--sm {
          width: 90px;
        }
        .select--me {
          width: 176px;
        }
        .select--lg {
          width: 300px;
        }
        .select--full {
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default FormSelect;
