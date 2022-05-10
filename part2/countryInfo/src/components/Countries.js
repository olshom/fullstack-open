import { useState } from "react";
import CountryLine from "./CountryLine"
import OneCountry from "./OneCountry";

const Countries = ({countries}) => {
    const [selectedCounty, setSelectedCountry ]= useState(null)
    return selectedCounty ? <OneCountry country={selectedCounty}/> : (
        <ul style={{listStyleType:'none'}}>
            {countries.map((country) => 
              <CountryLine country={country} key={country.name.common} setSelectedCountry={setSelectedCountry}/>
            )}
        </ul>
    )
}

export default Countries