async function getProperty(propertyID: string) {
  const res = await fetch(`http://localhost:3001/api/properties/${propertyID}`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
 
  return res.json();
}
 
export default async function Page({ params }: { params: { propertyID: string } }) {
  const property = await getProperty(params.propertyID);
 
  return (
    <div>
      <h1>Property Details</h1>
      <pre>{JSON.stringify(property, null, 2)}</pre>
    </div>
  );
}