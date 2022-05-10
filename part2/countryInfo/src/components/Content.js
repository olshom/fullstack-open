import Countries from './Countries'
import OneCountry from './OneCountry'

const Content = ({ countries, newFilter }) =>{
    const filteredCountries = countries.filter((country) => 
    country.name.common.toLowerCase().includes(newFilter.toLowerCase()))

    if (filteredCountries.length > 10) {
        return (<p>Too many matches, specify another filter</p>)
    } else if (filteredCountries.length === 1) {
       return ( <OneCountry country={filteredCountries[0]}/>)
    } else {
        return (<Countries countries={filteredCountries} />)
    }
}

export default Content


