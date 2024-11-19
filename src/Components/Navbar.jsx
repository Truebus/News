import { useState, useEffect } from "react";

export const Navbar = () => {
  const [data, setData] = useState({ articles: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('india');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
 
const apiKey = import.meta.env.VITE_APP_SECRET_KEY;

  // Fetching the data
  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = search;
        if (category) {
          query = category;
        }
        const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`);

        
        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [search, category]);

  // Handle input change for the search
  const handleValue = (e) => {
    setValue(e.target.value);
  };

  // Handle search button click
  const handleClick = () => {
    setSearch(value);
    setValue('');
    setCategory('');
  };

  // Handle category button click
  const handleCategory = (category) => {
    setCategory(category);
    setSearch('');
    setValue(category);
  };

  // Calculate the articles for current page
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentArticles = data.articles.slice(firstIndex, lastIndex);

  // Total pages
  const totalPages = Math.ceil(data.articles.length / itemsPerPage);

  // Handle pagination
  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  // Handle previous page click
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page click
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div className="bg-green-400 flex p-2 justify-around font-semibold text-white text-lg items-center">
        <h1>Trendy News</h1>
        <h2>Top News Headlines</h2>
        <div>
          <form>
            <input
              type="text"
              placeholder="Enter Here"
              onChange={handleValue}
              value={value}
              className="p-1 text-black rounded-md focus:outline-blue-800"
            />
            <button
              type="button"
              onClick={handleClick}
              className="ml-2 bg-sky-400 p-1 rounded-xl cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="flex items-center justify-center gap-x-5 bg-amber-200 p-2">
        <button type="button" onClick={() => handleCategory('sports')} className="bg-red-600 text-white font-semibold p-1 rounded-xl">
          Sports
        </button>
        <button type="button" onClick={() => handleCategory('technology')} className="bg-red-600 text-white font-semibold p-1 rounded-xl">
          Technology
        </button>
        <button type="button" onClick={() => handleCategory('politics')} className="bg-red-600 text-white font-semibold p-1 rounded-xl">
          Politics
        </button>
        <button type="button" onClick={() => handleCategory('entertainment')} className="bg-red-600 text-white font-semibold p-1 rounded-xl">
          Entertainment
        </button>
      </div>

      {/* Articles */}
      <div className="bg-yellow-300 h-auto w-full rounded-xl flex justify-around flex-wrap gap-2 p-2">
        {isLoading ? (
          <p>Loading...</p>
        ) : currentArticles.length > 0 ? (
          currentArticles.map((article, index) => (
            <div key={index} className="h-auto w-[250px] border-2 border-black bg-amber-200 p-2 shadow-md shadow-red-600 hover:scale-90 duration-500 ease-linear">
              {article.urlToImage ? (
                <img src={article.urlToImage} className="h-[90px] w-full" alt="Article" />
              ) : (
                <p className="font-semibold">Image Not Available</p>
              )}
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="underline text-red-700 font-semibold hover:text-blue-900 text-lg">
                {article.title}
              </a>
              <p>{article.description}</p>
            </div>
          ))
        ) : (
          <p>No articles found</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button type="button" onClick={handlePrev} disabled={currentPage === 1} className="p-2 mx-1 bg-gray-400 rounded-md">
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handlePagination(index + 1)}
            className={`p-2 mx-1 rounded-md bg-gray-300`}
          >
            {index + 1}
          </button>
        ))}
        <button type="button" onClick={handleNext} disabled={currentPage === totalPages} className="p-2 mx-1 bg-gray-400 rounded-md">
          Next
        </button>
      </div>
    </div>
  );
};
