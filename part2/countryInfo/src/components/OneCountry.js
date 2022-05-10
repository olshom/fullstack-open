const OneCountry = ({ country }) => {
    console.log(country)
    return (
    <div>
    <h2>{country.name.common}</h2>
    <p>capital {country.capital}</p>
    <p>area {country.area}</p>
    <h3>languages:</h3>
    <ul style={{listStyleType:'none'}}>
        {Object.entries(country.languages).map(([key,value]) => 
            <li key={key}>{value}</li>
        )}
    </ul>
    <img src={country.flags.png}/>
    </div>
    )
}

export default OneCountry