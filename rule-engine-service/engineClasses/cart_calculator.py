from models import Cart

class CartCalculator:
    def calculate_cart_metrics(self, cart) -> dict:
        categories = set()
        for line in cart.lines:
            if line.categoryId is not None:
                categories.add(line.categoryId)
        
        total_quantity = sum(line.quantity for line in cart.lines)
        average_price = cart.subtotal / cart.itemCount if cart.itemCount > 0 else 0
        
        return {
            "uniqueCategoriesCount": len(categories),
            "totalQuantity": total_quantity,
            "averageItemPrice": average_price
        }

    def calculate_subtotal_from_lines(self, cart) -> float:
        return sum(line.quantity * line.unitPrice for line in cart.lines)