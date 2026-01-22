import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CartItem } from "@/types/type";

interface CartItemsProps {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void; // NEW
  wishlist: { products: string[] }[];
}

export const CartItems: React.FC<CartItemsProps> = ({
  items,
  onRemoveItem,
  onToggleWishlist,
  onQuantityChange,
  wishlist,
}) => {
  return (
    <ScrollArea className="h-[400px] pr-4">
      {items.map((item) => {
        const isInWishlist = wishlist.some((w) =>
          w.products.includes(item.product._id)
        );

        return (
          <div
            key={item._id}
            className="flex flex-col md:flex-row gap-4 py-4 border-b last:border-0"
          >
            <Link href={`/products/${item.product.slug}`}>
              <Image
                src={item?.product?.images?.[0] || "/placeholder.png"}
                alt={item?.product?.title || "Product Image"}
                width={80}
                height={100}
                className="object-contain w-60 md:w-48 rounded-xl"
              />
            </Link>
            <div className="flex-1">
              <h3 className="font-medium">{item.product.title}</h3>

              {/* Quantity Controls */}
              <div className="mt-2 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onQuantityChange(item.product._id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    onQuantityChange(
                      item.product._id,
                      Math.max(1, Number(e.target.value))
                    )
                  }
                  className="w-12 text-center border rounded-md"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onQuantityChange(item.product._id, item.quantity + 1)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-1 font-medium">
                <span className="text-gray-500 line-through mr-2">
                  ₹{item.product.price}
                </span>
                ₹{item.product.finalPrice}
              </div>
              <div className="mt-1 text-sm text-green-600">
                {item.product.shippingCharge === "free"
                  ? "Free Shipping"
                  : `Shipping: ₹${item.product.shippingCharge}`}
              </div>

              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-[100px] md:w-[200px]"
                  onClick={() => onRemoveItem(item.product._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Remove</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-[100px] md:w-[200px]"
                  onClick={() => onToggleWishlist(item.product._id)}
                >
                  <Heart
                    className={`h-4 w-4 mr-1 ${isInWishlist ? "fill-red-500" : ""}`}
                  />
                  <span className="hidden md:inline">
                    {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </ScrollArea>
  );
};
