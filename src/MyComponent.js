import { useEffect, useState } from 'react';
import axios from 'axios';

function MyComponent() {
  const API_KEY_2 = 'f1ef82c7dc4d8c127c0f69f8739300a14807c3aa'
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`https://api.waqi.info/v2/map/bounds?latlng=85,-180,-85,180&networks=all&token=${API_KEY_2}`).then(async (response) => {
      const filteredData = response.data.data.filter((item) => item.aqi !== '-');
      const sortedData = filteredData.sort((a, b) => b.aqi - a.aqi);

      const promises = sortedData.slice(0, 10).map(async (item) => {
        const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${item.lat}&longitude=${item.lon}&localityLanguage=en`);
        return {
          ...item,
          city: res.data.locality,
          country: res.data.countryName
        };
      });

      const uniqueCities = {};
      const dataWithCityAndCountry = [];

      const results = await Promise.all(promises);

      results.forEach((item) => {
        if (!uniqueCities[item.city]) {
          uniqueCities[item.city] = true;
          dataWithCityAndCountry.push(item);
        }
      });

      setData(dataWithCityAndCountry);
    });
  }, []);

  return (
    <div>
      <h1>Worst 10 places by the Air Quality so far</h1>
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