import Link from "next/link";

// components/TopBar.tsx
export default function TopBar() {
  return (
    <div className="bg-[#7B2D8B] text-white text-xs py-1.5 px-5 flex justify-between">
      <span>Free shipping above ₹999 · COD available · 14-day returns</span>
      <div className="flex gap-4 opacity-80">
        <Link href="/track-order">Track Order</Link>
        <Link href="/sell">Sell on mysmme</Link>
      </div>
    </div>
  );
}
