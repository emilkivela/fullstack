import { useState, useEffect } from 'react'
import axios from 'axios'

const Search = ({ handleChange, filter }) => (
  <p>
    find countries <input value={filter} onChange={handleChange} />
  </p>
)

const CountryInfo = (props) => (
  <p>
    <h1>{props.countryData.name.common}{props.countryData.flag}</h1>
    area: {props.countryData.area}<br/>
    capital: {props.countryData.capital}<br/>
    <img src={props.countryData.flags.png} alt="flag of the country"></img>
          
    <h2>languages:</h2>
      <ul>
        {Object.keys(props.countryData.languages).map(key => 
          <span key={key}>
            <li>{props.countryData.languages[key]}</li>
          </span>
        )}
      </ul>

    </p>
)

const InfoButton = (props) => {
  
}

const Country = (props) => {
  if (props.countriesToShow.length === 1) {
    props.findCountry(props.countriesToShow[0])
    if (props.countryData) {
      return (
        <CountryInfo countryData={props.countryData}/>
      )
    }
  }
  if (props.countriesToShow.length < 10) {
    return (
      <p>
        <ul>
            {Object.keys(props.countriesToShow).map(key => 
              <span key={key}>
                <li>{props.countriesToShow[key]}<button onClick={() => props.setFilter(props.countriesToShow[key])}>show</button></li>
              </span>
            )}
          </ul>
      </p>
    )
  }
  if (props.countriesToShow.length > 10) {
      return (
        <p>
          Too many matches, speficy another filter
        </p>
    )
  }
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [countryData, setCountryData] = useState('')

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data.map(country => country.name.common))
      },)
  })
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const findCountry = (country) => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
      .then(response => {
        setCountryData(response.data)
      })
  }


  const countriesToShow = countries.filter(country => country.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <Search handleChange={handleFilterChange} filter={filter} />
      <Country setFilter={setFilter}countriesToShow={countriesToShow} findCountry={findCountry} countryData={countryData} />
    </div>
  )
}

export default App