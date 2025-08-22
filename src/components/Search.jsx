import './Search.css';

function Search() {
  return (
    <div className="search-container">
        <div className="search-bar-wrapper">
            <div className="search-bar-container">
                <div className="search-icon-container">
                    <img src="/magnifying-glass.png" alt="Search Icon" className="search-icon" />
                </div>
                <input type="text" placeholder="Search..." className="search-bar" />
            </div>
        </div>
        <div className="filters-wrapper">
            <span className="filters-container">
                <div className="filter-item filter-item-first filter-item-active">
                    Trending
                </div>
                <div className="filter-item">
                    Recent
                </div>
                <div className="filter-item filter-item-last">
                    Popular
                </div>
            </span>
        </div>
    </div>
  );
}

export default Search;
