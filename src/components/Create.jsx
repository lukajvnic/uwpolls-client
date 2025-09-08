import './Create.css';

function Create({ toggleCreate }) {
  return (
    <div className="wrapper">
      
        <div className="container">
          <span className="close-container" onClick={toggleCreate}>
            <img id="close-icon" src="/close-icon.svg" alt="Close" />
          </span>
            <input id="title-input" type="text" placeholder="What do you want to ask?" autoFocus />
            <div className="options-container">
              <div className="options-item">
                <input className="option" type="text" placeholder="Option #1" />
              </div>
              <div className="options-item">
                <input className="option" type="text" placeholder="Option #2" />
              </div>
              <div className="options-item">
                <input className="option" type="text" placeholder="Option #3" />
              </div>
              <div className="options-item">
                <input className="option" type="text" placeholder="Option #4" />
              </div>
            </div>
            <div className="post-container">
              <div className="post">Post</div>
            </div>
        </div>
    </div>
  );
}

export default Create;
