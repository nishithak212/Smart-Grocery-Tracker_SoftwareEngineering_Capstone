const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US"); // MM/DD/YYYY
};

const formatForInputDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // yyyy-MM-dd
};

export { formatDate, formatForInputDate };
