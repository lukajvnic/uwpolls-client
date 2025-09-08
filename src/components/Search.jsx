import './Search.css';
import React from 'react';


function Search() {
    const [selectedFilter, setSelectedFilter] = React.useState('trending');

    const filterTrending = async () => {
        setSelectedFilter('trending');

        const response = await fetch("http://127.0.0.1:3000/test/uwpolls", {
            mode: 'no-cors',
            method: "GET",
            // headers: {
            //     "Content-Type": "application/x-www-form-urlencoded",
            // },
        });

        console.log(response);
    }

    const filterRecent = async () => {
        setSelectedFilter('recent');

        console.log("Filter by Recent");
    }

    const filterPopular = async () => {
        setSelectedFilter('popular');

        console.log("Filter by Popular");
    }

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
                    <div className={`filter-item filter-item-first ${selectedFilter === 'trending' ? 'filter-item-active' : ''}`} onClick={filterTrending}>
                        Trending
                    </div>
                    <div className={`filter-item ${selectedFilter === 'recent' ? 'filter-item-active' : ''}`} onClick={filterRecent}>
                        Recent
                    </div>
                    <div className={`filter-item filter-item-last ${selectedFilter === 'popular' ? 'filter-item-active' : ''}`} onClick={filterPopular}>
                        Popular
                    </div>
                </span>
            </div>
        </div>
    );
}

export default Search;
