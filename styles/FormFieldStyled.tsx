import styled from 'styled-components';
import React from 'react';

export const FormFieldWrap = styled.div`
  border-top: 1.5px solid #000000;
  .wrapTitle {
    border-left: 0.5px solid #9b9b9b;
    border-bottom: 0.5px solid #9b9b9b;
    color: #282a2e;
    font-weight: 800;
    font-size: 20px;
    background-color: #dfe0e2;
    padding: 15px 30px;
    display: flex;
    align-items: center;
  }

  .wrapTitle--center {
    border-left: 0.5px solid #9b9b9b;
    border-bottom: 0.5px solid #9b9b9b;
    color: #282a2e;
    font-weight: 800;
    font-size: 20px;
    background-color: #dfe0e2;
    padding: 15px 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export interface FormFieldProps {
  required?: boolean;
  title: string | string[];
  children?: any;
  small?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  required,
  title,
  children,
  small = false,
}) => {
  return (
    <>
      <FieldRow>
        <Title small={small}>
          {required && <Required>*</Required>} <div>{title}</div>
        </Title>
        <Field>{children}</Field>
      </FieldRow>
    </>
  );
};

const Required = styled.span`
  font-size: 17px;
  font-weight: 700;
  color: #e00000;
`;

const FieldRow = styled.div`
  display: flex;
  border-bottom: 1px solid rgb(125, 125, 125);
`;

const shouldForwardProp = (prop: string) => !['small'].includes(prop);

const Title = styled.div.withConfig({ shouldForwardProp })<{ small: boolean }>`
  width: 110px;
  min-height: 40px;
  color: #282a2e;
  font-weight: 600;
  font-size: 13px;
  background-color:hsl(260, 17.60%, 90.00%);
  text-align: right;
  border-right: 1px solid rgb(125, 125, 125);
  display: flex;
  align-items: center;
  padding-left: 20px;
`;

const Field = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  min-height: 30px;
  padding: 5px 20px;
  background-color: white;
  word-break: break-all;

  &> input.sm {
    padding: 0 10px;
    height: 24px;
    width: 52px;
  };
  &> input.me {
    padding: 0 10px;
    height: 24px;
    width: 140px;
  };
  &> input.lg {
    padding: 0 10px;
    height: 24px;
    width: 260px;
  };
  &> input.full {
    padding: 0 10px;
    height: 24px;
    width: 100%;
  };
`;

export default FormField;
