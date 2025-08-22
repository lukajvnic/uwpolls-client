import './Panel.css';

function Search() {
  return (
    <div className="main-container">
        <div className="panel-container">
            <div className="title-container">
                What's your favourite colour?
            </div>
            <div className="answers-container">
                <form>
                    <div className="answer-option">
                        <input type="radio" id="red" name="fav_color" value="red" />
                        <label htmlFor="red">Red</label>
                    </div>
                    <div className="answer-option">
                        <input type="radio" id="blue" name="fav_color" value="blue" />
                        <label htmlFor="blue">Blue</label>
                    </div>
                    <div className="answer-option">
                        <input type="radio" id="green" name="fav_color" value="green" />
                        <label htmlFor="green">Green</label>
                    </div>
                    <div className="answer-option">
                        <input type="radio" id="yellow" name="fav_color" value="yellow" />
                        <label htmlFor="yellow">Yellow</label>
                    </div>
                </form>
            </div>
            <div className="footer-container">
                <div className="show-results-button">
                    Show Results
                </div>
            </div>
        </div>
        <div className="responses-container">
            7.6k responses
        </div>
    </div>
  );
}

export default Search;
