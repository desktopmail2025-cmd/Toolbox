import React, { useState, useEffect } from 'react';

interface SmartHintInputProps {
  defaultValue: number | string;
  value: number;
  onChange: (val: number) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number | string;
  placeholder?: string;
  id?: string;
  'aria-label'?: string;
}

export const SmartHintInput: React.FC<SmartHintInputProps> = ({
  defaultValue,
  value,
  onChange,
  className = '',
  min,
  max,
  step,
  placeholder,
  id,
  'aria-label': ariaLabel,
}) => {
  const defaultStr = String(defaultValue);
  const [displayVal, setDisplayVal] = useState<string>(String(value));
  const [isFocused, setIsFocused] = useState(false);

  // Sync external value when not focused
  useEffect(() => {
    if (!isFocused) {
      setDisplayVal(String(value));
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    // As soon as user clicks into the tool to give input, the hint vanishes!
    if (displayVal === defaultStr || displayVal === String(value)) {
      setDisplayVal('');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // If user clicks outside, show the default value again if empty or invalid
    if (displayVal.trim() === '' || isNaN(parseFloat(displayVal))) {
      setDisplayVal(defaultStr);
      const parsedDefault = typeof defaultValue === 'number' ? defaultValue : (parseFloat(defaultStr) || 0);
      onChange(parsedDefault);
    } else {
      const parsed = parseFloat(displayVal);
      onChange(parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If user presses back (Backspace) when field is empty, or Escape: restore default value
    if (e.key === 'Backspace' && displayVal === '') {
      setDisplayVal(defaultStr);
      const parsedDefault = typeof defaultValue === 'number' ? defaultValue : (parseFloat(defaultStr) || 0);
      onChange(parsedDefault);
    } else if (e.key === 'Escape') {
      setDisplayVal(defaultStr);
      const parsedDefault = typeof defaultValue === 'number' ? defaultValue : (parseFloat(defaultStr) || 0);
      onChange(parsedDefault);
      e.currentTarget.blur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setDisplayVal(newVal);
    if (newVal.trim() !== '') {
      const parsed = parseFloat(newVal);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  return (
    <input
      type="number"
      id={id}
      aria-label={ariaLabel}
      min={min}
      max={max}
      step={step}
      placeholder={isFocused ? '' : (placeholder || defaultStr)}
      value={displayVal}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      data-no-auto-clear="true"
      className={className}
    />
  );
};
