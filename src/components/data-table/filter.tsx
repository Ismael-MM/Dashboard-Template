import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterProps {
  type: 'text' | 'select';
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options?: FilterOption[];
}

export function Filter({ type, value, onChange, placeholder, options = []}: FilterProps) {
  if (type === 'select') {
    return (
      <Select value={value ?? ''} onValueChange={(val) => onChange(val === 'all' ? '' : val)}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder ?? 'Select...'}/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>
            {placeholder}
          </SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }else{
    return (
      <Input
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search...'}
        />
    );
  }
}