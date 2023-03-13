import { useEffect, useState } from 'react';
import axios from 'axios';

function MyComponent() {
  const API_KEY_1 = 'f1ef82c7dc4d8c127c0f69f8739300a14807c3aa';
  const API_KEY_2 = 'bdc_93e07e1f6abe446f8998b2b756216a17';

  // State to hold the data retrieved from the API
  const [data, setData] = useState([]);

  // Effect hook to retrieve data from the API
  useEffect(() => {
    axios.get(`https://api.waqi.info/v2/map/bounds?latlng=85,-180,-85,180&networks=all&token=${API_KEY_1}`).then(async (response) => {
      const filteredData = response.data.data.filter((item) => item.aqi !== '-');
      const sortedData = filteredData.sort((a, b) => b.aqi - a.aqi);

      // Map over the sorted data to get the city and country name for each item
      const promises = sortedData.slice(0, 20).map(async (item) => {
        const { city, country } = await getCityAndCountryName(item.lat, item.lon);
        return {
          ...item,
          city,
          country
        };
      });

      // Use Promise.all to wait for all the promises to resolve before continuing
      const results = await Promise.all(promises);

      // Filter out duplicates by city name
      const dataWithUniqueCities = filterDuplicates(results, 'city').slice(0, 10);

      // Sort the data by AQI value in descending order
      const sortedDataWithUniqueCities = dataWithUniqueCities.sort((a, b) => b.aqi - a.aqi);

      // Set the data state to the sorted and deduplicated data
      setData(sortedDataWithUniqueCities);
    });
  }, []);

  // Function to get the city and country name for a given latitude and longitude
  const getCityAndCountryName = async (lat, lon) => {
    const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode?key=${API_KEY_2}&latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    return {
      city: response.data.locality,
      country: response.data.countryName
    };
  };

  // Function to filter out duplicates from an array of objects by a given property
  const filterDuplicates = (arr, prop) => {
    const uniqueValues = {};
    return arr.filter((item) => {
      if (!uniqueValues[item[prop]]) {
        uniqueValues[item[prop]] = true;
        return true;
      }
      return false;
    });
  };

  // Render the data in the component
  return (
    <div>
      <h1>Worst 10 places by Air Quality right now</h1>
      <div>
        {data.map((item) => (
          <p key={item.uid}>
            {item.city}, <strong>{item.country}</strong> - AQI: {item.aqi}
          </p>
        ))}
      </div>
    </div>
  );
}

export default MyComponent;