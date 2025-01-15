import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker: React.FC<any> = ({ value, onChange, placeholder, ...props }) => {
  return (
    <DatePicker
      selected={value}
      onChange={onChange}
      placeholderText={placeholder}
      className="border rounded-lg p-2 w-full text-gray-700 placeholder-gray-500 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
      {...props}
    />
  );
};

export default CustomDatePicker;
