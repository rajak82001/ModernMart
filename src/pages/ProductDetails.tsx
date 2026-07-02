import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  return (
    <main>
      <h1>Product Details Page</h1>
      <p>Product ID: {id}</p>
    </main>
  );
};
export default ProductDetails;
