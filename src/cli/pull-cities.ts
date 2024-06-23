import { loadEnvConfig } from '@next/env';
import fetch from 'node-fetch';

import { createCliClient } from '@/lib/supabase/cli';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const supabase = createCliClient();

interface Region {
  id: string;
  title: string;
}

interface City {
  id: string;
  title: string;
  region: string;
}

const fetchRegions = async (): Promise<Region[]> => {
  const response = await fetch('https://namaztimes.kz/ru/json/states?sid=99');
  const data = (await response.json()) as Record<string, string>;

  return Object.entries(data).map(([id, title]) => ({
    id,
    title,
  }));
};

const fetchCities = async (region: string): Promise<City[]> => {
  const response = await fetch(
    `https://namaztimes.kz/ru/json/cities?cid=${region}`
  );
  const data = (await response.json()) as Record<string, string>;

  return Object.entries(data).map(([id, title]) => ({
    id,
    title,
    region,
  }));
};

const upsertCities = async (cities: City[], region: string) => {
  const upsertData = cities.map((city) => ({
    title: city.title,
    external_id: city.id,
    region,
  }));

  console.log('Upserting the following data:', upsertData); // Debugging log

  const { data, error } = await supabase
    .from('cities')
    .upsert(upsertData, { onConflict: 'external_id' })
    .select('*');

  if (error) {
    console.error('Error upserting cities:', error);
  } else {
    console.log('Upserted cities:', data);
  }
};

const main = async () => {
  try {
    const regions = await fetchRegions();
    for (const region of regions) {
      console.log(`Fetching cities for region: ${region.id}`); // Debugging log
      const cities = await fetchCities(region.id);

      console.log('Cities: ', cities);

      await upsertCities(cities, region.title);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(-1);
});
