import React, { useState } from "react";

import { FilterBarContainer } from "@/shared/FilterBar.style.jsx";
import FilterButton from "@/shared/FilterButton.jsx";

function FilterBar({ hiddenItems, className, children }) {
  const [filtersContainerOpen, toggleFiltersContainerOpen] = useState(false);

  return (
    <FilterBarContainer open={filtersContainerOpen} className={className}>
      <div className={"filter-controllers"}>{children}</div>
      <div className="toggle-button-container">
        <FilterButton
          itemsLength={hiddenItems}
          handleClick={() => toggleFiltersContainerOpen(!filtersContainerOpen)}
        />
      </div>
    </FilterBarContainer>
  );
}

export default FilterBar;
