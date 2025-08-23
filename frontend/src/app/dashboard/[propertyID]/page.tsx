export default function Page({ params }: { params: { propertyID: string } }) {
  return <h1>Hello, Property {params.propertyID}!</h1>;
}