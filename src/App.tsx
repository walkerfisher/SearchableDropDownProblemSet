import { useEffect, useState } from "react";
import { Dropdown } from "./components/Dropdown";
import "./styles.css";

export default function App() {
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data.map(
          (country: { name: { common: string } }) => country.name.common
        );
        setOptions(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
      setIsLoading(false);
    };

    fetchCountries();
  }, []);

  return (
    <div className="App">
      <h1>Searchable Dropdown Component</h1>
      <Dropdown options={options} />
    </div>
  );
}
