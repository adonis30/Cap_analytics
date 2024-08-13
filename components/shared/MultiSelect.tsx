import React, { useEffect, useRef, useState } from 'react';
import Select, { components, OptionProps, MenuListProps, MultiValue } from 'react-select';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CheckIcon, XCircle, ChevronDown, PlusCircle, XCircle as XCircleIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Custom option component with a checkbox
const CustomOption = (props: OptionProps<{ value: string; label: string }>) => (
  <components.Option {...props}>
    <input
      type="checkbox"
      checked={props.isSelected}
      onChange={() => null}
      className="mr-2"
    />
    {props.label}
  </components.Option>
);

// Custom menu list component with select all and clear all options
const CustomMenuList = (props: MenuListProps<{ value: string; label: string }>) => {
  const allOptionsSelected = props.options.length === props.getValue().length;

  const handleSelectAll = () => {
    if (allOptionsSelected) {
      props.clearValue();
    } else {
      props.setValue(
        props.options.map(option => option as { value: string; label: string }),
        'select-option'
      );
    }
  };

  const handleClearAll = () => {
    props.clearValue();
  };

  return (
    <components.MenuList {...props}>
      <div className="flex justify-between items-center p-2 border-b border-gray-300 bg-gray-50 rounded-t-lg">
        <span
          className="cursor-pointer text-blue-600 hover:text-blue-800"
          onClick={handleSelectAll}
        >
          {allOptionsSelected ? 'Clear All' : 'Select All'}
        </span>
        <span
          className="cursor-pointer text-red-600 hover:text-red-800"
          onClick={handleClearAll}
        >
          Clear
        </span>
      </div>
      {props.children}
    </components.MenuList>
  );
};

// Generic MultiSelect component
const MultiSelect = ({
  options,
  onValueChange,
  defaultValue = [],
  placeholder = "Select options",
  animation = 0,
  maxCount = 3,
  modalPopover = false,
  className,
  onCreateNewItem,
  createCategory,
  createFundingType,
  ...props
}: {
  options: { value: string; label: string }[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  className?: string;
  onCreateNewItem?: (newItem: string) => Promise<void>; // Function to handle creating new items
  createCategory?: (categoryName: string) => Promise<{ value: string; label: string }>;
  createFundingType?: (fundingTypeName: string) => Promise<{ value: string; label: string }>;
}) => {
  const [selectedValues, setSelectedValues] = useState<{ value: string; label: string }[]>(() => 
    options.filter(option => defaultValue.includes(option.value))
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newFundingType, setNewFundingType] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState(0);

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [isPopoverOpen]);

  const handleAddNewItem = async () => {
    if (onCreateNewItem && newItem.trim()) {
      try {
        await onCreateNewItem(newItem.trim());
        setNewItem('');
        // Optionally, you might want to add the new item to the options and select it
        // This depends on how your onCreateNewItem function works
      } catch (error) {
        console.error("Failed to create new item:", error);
      }
    }
  };

  const handleAddCategory = async () => {
    if (createCategory && newCategory.trim()) {
      try {
        const category = await createCategory(newCategory.trim());
        setSelectedValues(prev => [...prev, category]);
        onValueChange([...selectedValues.map(v => v.value), category.value]);
        setNewCategory('');
      } catch (error) {
        console.error("Failed to create category:", error);
      }
    }
  };

  const handleAddFundingType = async () => {
    if (createFundingType && newFundingType.trim()) {
      try {
        const fundingType = await createFundingType(newFundingType.trim());
        setSelectedValues(prev => [...prev, fundingType]);
        onValueChange([...selectedValues.map(v => v.value), fundingType.value]);
        setNewFundingType('');
      } catch (error) {
        console.error("Failed to create funding type:", error);
      }
    }
  };

  const handleSelectChange = (selectedOptions: MultiValue<{ value: string; label: string }>) => {
    const newSelectedValues = selectedOptions as { value: string; label: string }[];
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues.map(option => option.value));
  };

  const handleClear = () => {
    setSelectedValues([]);
    onValueChange([]);
  };

  return (
    <div>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            {...props}
            onClick={() => setIsPopoverOpen(prev => !prev)}
            className={`flex w-full p-2 rounded-lg border border-gray-300 shadow-md min-h-10 items-center justify-between bg-white hover:bg-gray-50 ${className}`}
          >
            {selectedValues.length > 0 ? (
              <div className="flex flex-wrap items-center select-none">
                {selectedValues.slice(0, maxCount).map(option => (
                  <Badge
                    key={option.value}
                    className="flex items-center mr-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                    style={{ animationDuration: `${animation}s` }}
                  >
                    {option.label}
                    <XCircleIcon
                      className="ml-2 h-4 w-4 cursor-pointer text-red-600"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSelectChange(selectedValues.filter(v => v.value !== option.value));
                      }}
                    />
                  </Badge>
                ))}
                {selectedValues.length > maxCount && (
                  <Badge className="flex items-center bg-transparent text-gray-600 border-gray-300 px-2 py-1 rounded-full">
                    {`+ ${selectedValues.length - maxCount} more`}
                    <XCircleIcon
                      className="ml-2 h-4 w-4 cursor-pointer text-red-600"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSelectChange(selectedValues.slice(0, maxCount));
                      }}
                    />
                  </Badge>
                )}
              </div>
            ) : (
              <span className="ml-2 text-gray-400">{placeholder}</span>
            )}
            <ChevronDown className="h-4 mx-2 cursor-pointer text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-4 bg-white border border-gray-200 shadow-lg rounded-lg"
          style={{ width: triggerWidth }}
        >
          <Select
            isMulti
            value={selectedValues}
            onChange={handleSelectChange}
            options={options}
            placeholder={placeholder}
            className="react-select-container"
            classNamePrefix="react-select"
            components={{
              MultiValue: () => null,
              Option: CustomOption,
              MenuList: CustomMenuList
            }}
          />
          <div className="flex items-center justify-between mt-4">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleClear} 
              className="h-9 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Clear
            </Button>
            {(onCreateNewItem || createCategory || createFundingType) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="w-full bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center px-4 py-2"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add new item
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white rounded-lg p-4">
                  <AlertDialogHeader>
                    <AlertDialogTitle>New Item</AlertDialogTitle>
                    <AlertDialogDescription>
                      {onCreateNewItem && (
                        <Input
                          type="text"
                          placeholder="Item name"
                          className="input-field mt-3"
                          value={newItem}
                          onChange={(e) => setNewItem(e.target.value)}
                        />
                      )}
                      {createCategory && (
                        <Input
                          type="text"
                          placeholder="Category Name"
                          className="input-field mt-3"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                      )}
                      {createFundingType && (
                        <Input
                          type="text"
                          placeholder="Funding Type Name"
                          className="input-field mt-3"
                          value={newFundingType}
                          onChange={(e) => setNewFundingType(e.target.value)}
                        />
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {onCreateNewItem && (
                      <AlertDialogAction 
                        onClick={handleAddNewItem}
                        disabled={!newItem.trim()}
                      >
                        Add Item
                      </AlertDialogAction>
                    )}
                    {createCategory && (
                      <AlertDialogAction 
                        onClick={handleAddCategory}
                        disabled={!newCategory.trim()}
                      >
                        Add Category
                      </AlertDialogAction>
                    )}
                    {createFundingType && (
                      <AlertDialogAction 
                        onClick={handleAddFundingType}
                        disabled={!newFundingType.trim()}
                      >
                        Add Funding Type
                      </AlertDialogAction>
                    )}
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiSelect;