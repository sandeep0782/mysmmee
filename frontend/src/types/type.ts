export interface IVariant {
  sku: string;
  brandSize?: string; // e.g., "M", "L"
  standardSize?: number;
  isStandardSizeOnLabel?: boolean;
  stock: number;
  price: number;
  finalPrice: number;
  measurements?: {
    bust?: number;
    hip?: number;
    waist?: number;
    outseamLength?: number;
    toFitWaist?: number;
  };
}
export interface ISetDetails {
  setType?: string;
  sareeFabric?: string;
  blouseFabric?: string;
  blouseIncluded?: boolean;
}

export interface IFashionDetails {
  fashionType?: string;
  usage?: string;
  occasion?: string;
  year?: number;
  pattern?: string;
  printOrPatternType?: string;
  ornamentation?: string;
  border?: string;
  trends?: boolean;
  mainTrend?: string;
  sustainable?: boolean;
  stitch?: string;
  careInstructions?: string;
  sizeAndFitDescription?: string;
  whereToWear?: string;
  styleTip?: string;
}

export interface IMetadata {
  styleId?: string;
  styleGroupId?: string;
  vendorSkuCode?: string;
  vendorArticleNumber?: string;
}
export interface BookDetails {
  _id: string;
  title: string;
  slug: string;
  images: string[];
  subject: string;
  articleType: ArticleType;
  brand: Brand;
  color: Colors;
  season: string;
  gender: string;
  category: Category;
  condition: string;
  classType: string;
  price: number;
  author: string;
  edition?: string;
  description?: string;
  finalPrice: number;
  shippingCharge: string;
  metadata?: IMetadata;
  setDetails?: ISetDetails;
  fashionDetails?: IFashionDetails;
  variants: IVariant[];
  seller: UserData;
  paymentMode: "UPI" | "Bank Account";
  paymentDetails: {
    upiId?: string;
    bankDetails?: {
      accountNumber: string;
      ifscCode: string;
      bankName: string;
    };
  };
  rating: number;
  numReviews: number;
  reviews: Review[];
  createdAt: Date;
}

export interface ProductDetails {
  _id: string;
  title: string;
  slug: string;
  images: string[];
  subject: string;
  articleType: ArticleType;
  brand: Brand;
  color: Colors;
  season: string;
  gender: string;
  category: Category;
  condition: string;
  classType: string;
  price: number;
  author: string;
  edition?: string;
  description?: string;
  finalPrice: number;
  shippingCharge: string;
  metadata?: IMetadata;
  setDetails?: ISetDetails;
  fashionDetails?: IFashionDetails;
  variants: IVariant[];
  seller: UserData;
  paymentMode: "UPI" | "Bank Account";
  paymentDetails: {
    upiId?: string;
    bankDetails?: {
      accountNumber: string;
      ifscCode: string;
      bankName: string;
    };
  };
  rating: number;
  numReviews: number;
  reviews: Review[];
  createdAt: Date;
}
export interface UserData {
  name: string;
  email: string;
  profilePicture: string;
  phoneNumber: string;
  addresses: Address[];
}

export interface Address {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  phoneNumber: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Product {
  _id: string;
  slug: string;
  images: string[];
  title: string;
  price: number;
  finalPrice: number;
  shippingCharge: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  _id: string;
  product: BookDetails;
  quantity: number;
}

export interface PaymentDetails {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface Order {
  _id: string;
  user: UserData;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
  shippingAddress: Address;
  paymentStatus: string;
  paymentMethod: string;
  paymentDetails: PaymentDetails;
  status: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}
export interface Colors {
  _id: string;
  name: string;
  slug: string;
}
export interface Brand {
  _id: string;
  name: string;
  slug: string;
}
export interface ArticleType {
  _id: string;
  name: string;
  slug: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface MenuCategory {
  _id: string;
  name: string;
  slug: string;
  articleTypes: ArticleType[];
}

export interface Review {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    _id: string;
    name: string;
  };
}
