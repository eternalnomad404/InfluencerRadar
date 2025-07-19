

const Pagination = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <button className="px-3 py-2 border border-gray-300 !rounded-button text-sm text-gray-500 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
        Previous
      </button>
      <button className="px-3 py-2 bg-blue-600 text-white !rounded-button text-sm font-medium cursor-pointer whitespace-nowrap">
        1
      </button>
      <button className="px-3 py-2 border border-gray-300 !rounded-button text-sm text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
        2
      </button>
      <button className="px-3 py-2 border border-gray-300 !rounded-button text-sm text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
        3
      </button>
      <button className="px-3 py-2 border border-gray-300 !rounded-button text-sm text-gray-500 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
        Nex
      </button>
    </div>
  );
};

export default Pagination;
