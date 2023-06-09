import { getDatabase, ref, get, child, update } from "firebase/database";
import getFirebaseApp from "./firebaseApp";

export async function updateStockBalance(cartItems, setIsCheckedOut, setCartItems, setStatus) {
    
    // Get the Firebase database reference and products reference
    const database = getDatabase(getFirebaseApp());
    const productsRef = ref(database, "products");

    try {
        // Update the stock balance of each item in the cart
        for (const item of cartItems) {
            const snapshot = await get(child(productsRef, `item${item.id}`));
            const stockBalance = snapshot.val().stockbalance;
            
            // Check if all items have enough stock balance
            if (item.quantity > stockBalance) {
                return setStatus('outOfBalance');;
            }

            const updatedBalance = stockBalance - item.quantity;
            // Update the stock balance in the database
            await update(child(productsRef, `item${item.id}`), { stockbalance: updatedBalance });
        }
        setIsCheckedOut(true);
        setCartItems([]);
    } catch (error) {
        setStatus('error');
    }
}
