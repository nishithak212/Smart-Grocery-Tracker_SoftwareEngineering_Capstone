import React from "react";
import sort from "../../assets/sort-solid.svg";
import sortup from "../../assets/sort-up-solid.svg";
import sortdown from "../../assets/sort-down-solid.svg";

const SortIcon = ({ sortKey, columnKey, sortOrder }) => {
  if (sortKey === columnKey) {
    return sortOrder === "asc" ? (
      <img src={sortup} alt="Sort-Ascending" width="12" />
    ) : (
      <img src={sortdown} alt="Sort-Descending" width="12" />
    );
  }

  return <img src={sort} alt="Sort" width="12" />;
};

export default SortIcon;
