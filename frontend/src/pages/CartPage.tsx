import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <h2>Your Cart</h2>
      <div className="cart-container">
        {cart.length === 0 ? (
          <div className="empty-cart-message">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="cart-items-grid">
            {cart.map((item) => (
              <div
                key={item.bookId}
                className="card p-4 mb-4 rounded-lg shadow-md bg-white"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <span
                    className="px-3 py-1 rounded-lg text-center"
                    style={{ backgroundColor: "#cecece" }}
                  >
                    {item.quantity}
                  </span>
                </div>
                {/* Price and Subtotal Section */}
                <div className="mt-3 text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Price: ${item.price.toFixed(2)}</span>
                    <br></br>
                    <span className="font-medium">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <button
                    className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
                    onClick={() => removeFromCart(item.bookId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <h2>Total: ${totalAmount}</h2>
      <button onClick={() => navigate("/")}>Continue Browsing</button>
    </>
  );
}

export default CartPage;
