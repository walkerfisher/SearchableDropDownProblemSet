import { useEffect, useRef, useState } from "react";

type SearchableDropdownProps = {
  options: string[];
};

export const Dropdown: React.FC<SearchableDropdownProps> = ({ options }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Filter options based on search term
    setFilteredOptions(
      searchTerm === ""
        ? options
        : options.filter((option) =>
            option.toLowerCase().includes(searchTerm.toLowerCase())
          )
    );
  }, [options, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1); // Reset highlighted index on new search
  };

  const handleSelect = (option: string) => {
    setSearchTerm(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === "ArrowDown" &&
      highlightedIndex < filteredOptions.length - 1
    ) {
      setHighlightedIndex((prev) => prev + 1);
    } else if (event.key === "ArrowUp" && highlightedIndex > 0) {
      setHighlightedIndex((prev) => prev - 1);
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      handleSelect(filteredOptions[highlightedIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 150); // Delay to allow item clicks
  };

  return (
    <div className="searchable-dropdown">
      <input
        id="search-input"
        type="text"
        value={searchTerm}
        ref={inputRef}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => setIsOpen(true)}
        aria-controls="options-list"
        aria-expanded={isOpen}
        aria-activedescendant={
          highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined
        }
        placeholder="Search options..."
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul id="options-list" role="listbox" className="options-list">
          {filteredOptions.map((option, index) => (
            <li
              key={option}
              role="option"
              id={`option-${index}`}
              aria-selected={highlightedIndex === index}
              tabIndex={-1}
              className={`option-item ${
                index === highlightedIndex ? "highlighted" : ""
              }`}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
      {isOpen && filteredOptions.length === 0 && (
        <div className="no-results">No results found</div>
      )}
    </div>
  );
};
