import Navbar from '../components/Navbar';
import Search from '../components/Search';
import Panel from '../components/Panel';
import Create from '../components/Create';
import './Home.css';

function Home() {
  return (
    <div>
      
      <Navbar />
      <Search />
      <div className="panels-container">
        <Panel />
        <Panel />
        <Panel />
      </div>
    </div>
  );
}

export default Home;