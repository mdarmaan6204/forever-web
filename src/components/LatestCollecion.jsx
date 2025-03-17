import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollecion = () => {
  const { products } = useContext(ShopContext);
  const [latestCollection, setLatestCollection] = useState([]);
  // console.log(products);

  useEffect(() => {
    setLatestCollection(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our newest arrivals that blend style and comfort. Explore the
          latest trends in fashion, curated just for you.
        </p>
      </div>

      {/* Rendering products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestCollection &&
          latestCollection.map((product, idx) => (
            <ProductItem
              key={idx}
              id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))}
      </div>
    </div>
  );
};

export default LatestCollecion;
