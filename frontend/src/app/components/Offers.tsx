'i'
import { useState } from "react";

const BestOffers = ({ product }: { product: { finalPrice: number } }) => {
  const [openTerms, setOpenTerms] = useState<number | null>(null);

  const toggleTerms = (index: number) => {
    setOpenTerms(openTerms === index ? null : index);
  };

  const offers = [
    {
      title: "MYSMMEFIRST",
      description: "Get Rs. 300 off on purchases above Rs. 3000 (first purchase only).",
      terms: "Valid for first purchase only. Cannot be combined with other coupons."
    },
    {
      title: "EXCHANGE30",
      description: "Return your old product and get up to 30% discount on the new purchase.",
      terms: "Discount capped at 30%. Product must be in good condition. Exchange applicable once per product."
    },
    {
      title: "NORETURN",
      description: "Get Rs. 100 off on each product. Customer acknowledges no return, but one-time exchange is allowed.",
      terms: "Products bought using this coupon cannot be returned. One-time exchange available within 7 days. Coupon valid on select products only."
    },
    {
      title: "CASHBACKAXIS",
      description: "7.5% assured cashback on Flipkart Axis Bank Credit Card. Max cashback INR 4,000 per quarter.",
      terms: "Cashback not applicable on transactions < INR 100."
    },
    {
      title: "CASHBACKSBI",
      description: "7.5% assured cashback on Flipkart SBI Credit Card. Max cashback INR 4,000 per quarter.",
      terms: "Cashback not applicable on transactions < INR 100."
    },
    {
      title: "EMI",
      description: "EMI starting from Rs. 54/month. Easy installment options available.",
      terms: "EMI applicable as per bank terms. Check plan details before purchase."
    },
    {
      title: "FREEDELIVERY",
      description: "Free delivery on orders above Rs. 500.",
      terms: "Standard delivery terms apply. Offer valid while stocks last."
    }
  ];

  return (
    <div className="border p-4 rounded-md space-y-4 bg-white shadow-sm">
      <h2 className="font-bold text-lg text-gray-900 mb-2">BEST OFFERS</h2>

      {offers.map((offer, index) => (
        <div key={index} className="space-y-1">
          <p className="text-gray-800 font-medium flex items-center gap-2">
            ✅ <span className="font-bold">{offer.title}:</span> {offer.description}
          </p>
          <p
            className="text-blue-600 cursor-pointer text-sm hover:underline"
            onClick={() => toggleTerms(index)}
          >
            Terms & Conditions
          </p>
          {openTerms === index && (
            <p className="text-gray-600 text-sm border-l-2 border-blue-200 pl-2 mt-1">
              {offer.terms}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default BestOffers;
