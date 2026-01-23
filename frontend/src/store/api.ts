import { MenuCategory } from "@/types/type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const API_URLS = {
  // User related URLs
  REGISTER: `${BASE_URL}/api/auth/register`,
  LOGIN: `${BASE_URL}/api/auth/login`,
  GOOGLE_LOGIN: `${BASE_URL}/api/auth/google`,
  VERIFY_EMAIL: (token: string) => `${BASE_URL}/api/auth/verify-email/${token}`,
  FORGOT_PASSWORD: `${BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: (token: string) =>
    `${BASE_URL}/api/auth/reset-password/${token}`,
  VERIFY_AUTH: `${BASE_URL}/api/auth/verify-auth`,
  LOGOUT: `${BASE_URL}/api/auth/logout`,
  UPDATE_USER_PROFILE: (userId: string) =>
    `${BASE_URL}/api/users/profile/update/${userId}`,

  // Product related URLs
  BRANDS: `${BASE_URL}/api/brands`,
  CATEGORIES: `${BASE_URL}/api/categories`,
  ARTICLETYPE: `${BASE_URL}/api/articleTypes`,
  COLORS: `${BASE_URL}/api/colors`,
  SEASONS: `${BASE_URL}/api/season`,

  MENU: `${BASE_URL}/api/menu`,

  // Product related URLs
  PRODUCTS: `${BASE_URL}/api/products`,
  PRODUCT_BY_ID: (id: string) => `${BASE_URL}/api/products/${id}`,
  PRODUCT_BY_SLUG: (slug: string) => `${BASE_URL}/api/products/slug/${slug}`,
  GET_PRODUCT_BY_SELLERID: (sellerId: string) =>
    `${BASE_URL}/api/products/seller/${sellerId}`,
  DELETE_PRODUCT_BY_PRODUCTID: (productId: string) =>
    `${BASE_URL}/api/products/seller/${productId}`,

  // Cart related URLs
  CART: (userId: string) => `${BASE_URL}/api/cart/${userId}`,
  ADD_TO_CART: `${BASE_URL}/api/cart/add`,
  REMOVE_FROM_CART: (productId: string) =>
    `${BASE_URL}/api/cart/remove/${productId}`,
  UPDATE_CART_ITEM: (productId: string) =>
    `${BASE_URL}/api/cart/update/${productId}`,

  // Wishlist related URLs
  WISHLIST: `${BASE_URL}/api/wishlist`,
  ADD_TO_WISHLIST: `${BASE_URL}/api/wishlist/add`,
  REMOVE_FROM_WISHLIST: (productId: string) =>
    `${BASE_URL}/api/wishlist/remove/${productId}`,

  // Order related URLs
  ORDERS: `${BASE_URL}/api/orders`,
  ORDER_BY_ID: (orderId: string) => `${BASE_URL}/api/orders/${orderId}`,
  CREATE_PAYMENT_INTENT: `${BASE_URL}/api/orders/payment-razorpay`,

  //address related URLs
  GET_ADDRESS: `${BASE_URL}/api/address`,
  ADD_OR_UPDATE_ADDRESS: `${BASE_URL}/api/address/create-or-update`,

  GET_REVIEW: `${BASE_URL}/api/reviews`,
  ADD_REVIEW: (productId: string) => `${BASE_URL}/api/reviews/${productId}`,
};

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: [
    "User",
    "Product",
    "Cart",
    "Wishlist",
    "Order",
    "Address",
    "Brand",
    "Category",
    "Color",
    "Season",
    "Article Type",
  ],
  endpoints: (builder) => ({
    // User endpoints
    register: builder.mutation({
      query: (userData) => ({
        url: API_URLS.REGISTER,
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: API_URLS.LOGIN,
        method: "POST",
        body: credentials,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: API_URLS.VERIFY_EMAIL(token),
        method: "GET",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: API_URLS.FORGOT_PASSWORD,
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: API_URLS.RESET_PASSWORD(token),
        method: "POST",
        body: { newPassword },
      }),
    }),
    verifyAuth: builder.mutation({
      query: () => ({
        url: API_URLS.VERIFY_AUTH,
        method: "GET",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: API_URLS.LOGOUT,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: API_URLS.UPDATE_USER_PROFILE(userId),
        method: "PUT",
        body: userData,
      }),
    }),

    getMenu: builder.query<MenuCategory[], void>({
      query: () => API_URLS.MENU,
      providesTags: ["Category"],
    }),

    getBrands: builder.query({
      query: () => API_URLS.BRANDS,
      providesTags: ["Brand"],
    }),
    createBrand: builder.mutation({
      query: (brandData) => ({
        url: API_URLS.BRANDS,
        method: "POST",
        body: brandData,
      }),
      invalidatesTags: ["Brand"],
    }),

    // Category Endpoints
    getCategories: builder.query({
      query: () => API_URLS.CATEGORIES,
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: API_URLS.CATEGORIES,
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Category"],
    }),

    // Category Endpoints
    getArticleTypes: builder.query({
      query: () => API_URLS.ARTICLETYPE,
      providesTags: ["Article Type"],
    }),
    createArticleTypes: builder.mutation({
      query: (ArticleTypeData) => ({
        url: API_URLS.ARTICLETYPE,
        method: "POST",
        body: ArticleTypeData,
      }),
      invalidatesTags: ["Category"],
    }),

    // Color Endpoints
    getColors: builder.query({
      query: () => API_URLS.COLORS,
      providesTags: ["Color"],
    }),
    createColor: builder.mutation({
      query: (colorData) => ({
        url: API_URLS.COLORS,
        method: "POST",
        body: colorData,
      }),
      invalidatesTags: ["Color"],
    }),

    // Season Endpoints
    getSeasons: builder.query({
      query: () => API_URLS.SEASONS,
      providesTags: ["Season"],
    }),
    createSeason: builder.mutation({
      query: (seasonData) => ({
        url: API_URLS.SEASONS,
        method: "POST",
        body: seasonData,
      }),
      invalidatesTags: ["Season"],
    }),

    // Product endpoints
    addProducts: builder.mutation({
      query: (productData) => ({
        url: API_URLS.PRODUCTS,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    getProducts: builder.query({
      query: () => API_URLS.PRODUCTS,
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => API_URLS.PRODUCT_BY_ID(id),
      providesTags: ["Product"],
    }),
    getProductBySlug: builder.query({
      query: (slug) => API_URLS.PRODUCT_BY_SLUG(slug),
      providesTags: ["Product"],
    }),

    getProductBySellerId: builder.query({
      query: (sellerId) => API_URLS.GET_PRODUCT_BY_SELLERID(sellerId),
      providesTags: ["Product"],
    }),

    deleteProductById: builder.mutation({
      query: (productId) => ({
        url: API_URLS.DELETE_PRODUCT_BY_PRODUCTID(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Cart endpoints
    getCart: builder.query({
      query: (userId) => API_URLS.CART(userId),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (productData) => ({
        url: API_URLS.ADD_TO_CART,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: API_URLS.REMOVE_FROM_CART(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItemQuantity: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: API_URLS.UPDATE_CART_ITEM(productId),
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    // Wishlist endpoints
    getWishlist: builder.query({
      query: () => API_URLS.WISHLIST,
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: API_URLS.ADD_TO_WISHLIST,
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: API_URLS.REMOVE_FROM_WISHLIST(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Order endpoints
    getUserOrders: builder.query({
      query: () => API_URLS.ORDERS,
      providesTags: ["Order"],
    }),
    getOrderById: builder.query({
      query: (orderId) => API_URLS.ORDER_BY_ID(orderId),
      providesTags: ["Order"],
    }),
    createOrUpdateOrder: builder.mutation({
      query: ({ orderId, updates }) => ({
        url: API_URLS.ORDERS,
        method: orderId ? "PATCH" : "POST",
        body: updates,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),
    createRazorpayPayment: builder.mutation({
      query: (orderId) => ({
        url: API_URLS.CREATE_PAYMENT_INTENT,
        method: "POST",
        body: { orderId },
      }),
    }),

    getAddresses: builder.query<any[], void>({
      query: () => API_URLS.GET_ADDRESS,
      providesTags: ["Address"],
    }),
    addOrUpdateAddress: builder.mutation<any, any>({
      query: (address) => ({
        url: API_URLS.ADD_OR_UPDATE_ADDRESS,
        method: "POST",
        body: address,
      }),
      invalidatesTags: ["Address"],
    }),

    addReview: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: API_URLS.ADD_REVIEW(productId),
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: ["Product"],
    }),
    getReviews: builder.query({
      query: (productId: string) => `${API_URLS.GET_REVIEW}/${productId}`,
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyAuthMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useAddProductsMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySellerIdQuery,
  useDeleteProductByIdMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrUpdateOrderMutation,
  useCreateRazorpayPaymentMutation,
  useAddOrUpdateAddressMutation,
  useGetAddressesQuery,

  useGetBrandsQuery,
  useCreateBrandMutation,

  useGetCategoriesQuery,
  useCreateCategoryMutation,

  useGetArticleTypesQuery,
  useCreateArticleTypesMutation,

  useGetColorsQuery,
  useCreateColorMutation,

  useGetSeasonsQuery,
  useCreateSeasonMutation,

  useGetProductBySlugQuery,

  useGetMenuQuery,
  useUpdateCartItemQuantityMutation,

  useAddReviewMutation,
  useGetReviewsQuery,
} = api;
