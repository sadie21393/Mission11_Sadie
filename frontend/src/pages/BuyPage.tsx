import { useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";
import { useState } from "react";

function BuyPage() {
  const navigate = useNavigate();
  const { title, bookId, price } = useParams();
  const { addtoCart } = useCart();
  const [quantity, setquantity] = useState<number>(0);

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId),
      title: title || "No Book Found",
      price: Number(price),
      quantity,
    };
    addtoCart(newItem);
    navigate("/cart");
  };

  return (
    <>
      <WelcomeBand />
      <h2>Confirm Purchase: {title} </h2>

      <div>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(x) => setquantity(Number(x.target.value))}
        ></input>
        <button onClick={handleAddToCart}>Add to Cart</button>

        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </>
  );
}

export default BuyPage;
