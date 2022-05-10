import { useState } from "react";
import OneCountry from "./OneCountry";

const CountryLine = ({ country, setSelectedCountry }) =>{
    
    const showCountry = (country) => {
        setSelectedCountry(country)
    }
    
    return  (
        <li>
            {country.name.common}
            <button onClick={()=>showCountry(country)}>Show</button>
        </li>
    )
}

export default CountryLine