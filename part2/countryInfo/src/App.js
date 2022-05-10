import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Content from './components/Content';
import Filter from './components/Filter';


function App() {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')

  useEffect(() =>{
    axios
    .get('https://restcountries.com/v3.1/all')
    .then(response => {
      setCountries(response.data)
    })
  }, [])

  const handleSearch = (event) => {
    setNewFilter(event.target.value)
  }

    console.log(countries)
  return (
    <div>
      <Filter 
        newFilter={newFilter} 
        handleSearch={handleSearch} 
      />
      <Content 
        countries={countries}
        newFilter={newFilter}
      />
    </div>
  );
}

export default App;


/*<Countries countries={countries} newFilter={newFilter}/>*/