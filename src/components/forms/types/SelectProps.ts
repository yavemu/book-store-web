interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { 
  label?: string; 
  options?: SelectOption[];
  error?: string;
}