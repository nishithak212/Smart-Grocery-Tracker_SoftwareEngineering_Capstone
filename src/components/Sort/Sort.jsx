import React from "react";
import sort from "../../assets/icons/sort-solid.svg";
import sortup from "../../assets/icons/sort-up-solid.svg";
import sortdown from "../../assets/icons/sort-down-solid.svg";
import "../Sort/Sort.scss";

const SortIcon = ({ sortKey, columnKey, sortOrder }) => {
  if (sortKey === columnKey) {
    return sortOrder === "asc" ? (
      <img className="sorticon" src={sortup} alt="Sort-Ascending" width="12" />
    ) : (
      <img
        className="sorticon"
        src={sortdown}
        alt="Sort-Descending"
        width="12"
      />
    );
  }

  return <img className="sorticon" src={sort} alt="Sort" width="12" />;
};

export default SortIcon;
