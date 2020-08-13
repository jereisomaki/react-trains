import React, { useState } from 'react';
import Map from './components/map';
import Header from './components/header';

const App = () => {

  const [searchID, setSearchID] = useState(null);

  return (
    <div className="App">
      <Header setSearchID={setSearchID} />
      <Map searchID={searchID} setSearchID={setSearchID}/>
    </div>
  );
}

export default App;
