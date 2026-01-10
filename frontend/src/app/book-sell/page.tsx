'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Camera, HelpCircle, Book, DollarSign, User, MapPin, ChevronRight, X, CreditCard, Loader2 } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { BookDetails } from '@/types/type'
import { useAddProductsMutation, useGetBrandsQuery, useGetCategoriesQuery, useGetColorsQuery, useGetSeasonsQuery } from '@/store/api'
import { filters } from '@/constant/Filter'
import { useRouter } from 'next/navigation'
import NoData from '@/lib/NoData'
import { RootState } from '@/store/store'
import { toggleLoginDialog } from '@/store/slices/userSlice'


export default function SellBookPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [addProducts, { isLoading }] = useAddProductsMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);


  const { data: brandResponse } = useGetBrandsQuery({});
  const brands = brandResponse?.data || [];

  const { data: seasonResponse } = useGetSeasonsQuery({});
  const season = seasonResponse?.data || [];

  const { data: colorResponse } = useGetColorsQuery({});
  const color = colorResponse?.data || [];

  const { data: categoryResponse } = useGetCategoriesQuery({});
  const category = categoryResponse?.data || [];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookDetails>({
    defaultValues: {
      images: []
    }
  });

  useEffect(() => {
    if (user && user.role !== "user") {
      router.push('/admin')
    }
  }, [user, router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const currentFiles = watch('images') || [];

      // Update the preview state with URLs for display
      setUploadedImages((prevImages) =>
        [...prevImages, ...newFiles.map((file) => URL.createObjectURL(file))].slice(0, 4)
      );

      // Update the form state with actual File objects
      setValue('images', [...currentFiles, ...newFiles].slice(0, 4) as string[]);
    }
  };


  const removeImage = (index: number) => {
    // Update the preview state
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));

    // Update the form state
    const currentFiles = watch('images') || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    setValue('images', updatedFiles);
  };

  const onSubmit = async (data: BookDetails) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'images') {
          formData.append(key, value as string);
        }
      });
      if (data.paymentMode === 'UPI') {
        formData.set('paymentDetails', JSON.stringify({ upiId: data.paymentDetails?.upiId }));
      } else if (data.paymentMode === 'Bank Account') {
        formData.set('paymentDetails', JSON.stringify({ bankDetails: data.paymentDetails?.bankDetails }));
      }

      if (Array.isArray(data.images) && data.images.length > 0) {
        data.images.forEach((image) => formData.append('images', image));
      } else {
        toast.error('please select images')
        return
      }

      const result = await addProducts(formData).unwrap();
      if (result.success) {
        router.push(`books/${result.data._id}`)
        toast.success('Book listed successfully!');
        reset();
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  const paymentMode = watch('paymentMode');
  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };

  if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="You need to be logged in to view your cart and checkout."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Sell Your Used Books</h1>
          <p className="text-xl text-gray-600 mb-4">Submit a free classified ad to sell your used books for cash in India</p>
          <Link href="#" className="text-blue-500 hover:underline inline-flex items-center">
            Learn how it works
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Book Details */}
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-2xl text-blue-700 flex items-center">
                <Book className="mr-2 h-6 w-6" />
                Book Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="title" className="md:w-1/4 font-medium text-gray-700">Ad Title</Label>
                <div className="md:w-3/4">
                  <Input
                    id="title"
                    placeholder="Enter your ad title"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="category" className="md:w-1/4 font-medium text-gray-700">Category</Label>
                <div className="md:w-3/4">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value?._id || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {category.map((cat:any) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>
              </div>

              {/* Brand */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="brand" className="md:w-1/4 font-medium text-gray-700">Brand</Label>
                <div className="md:w-3/4">
                  <Controller
                    name="brand"
                    control={control}
                    rules={{ required: 'Brand is required' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select Brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand: any) => (
                            <SelectItem key={brand._id} value={brand._id}>{brand.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                </div>
              </div>

              {/* Season */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="season" className="md:w-1/4 font-medium text-gray-700">Season</Label>
                <div className="md:w-3/4">
                  <Controller
                    name="season"
                    control={control}
                    rules={{ required: 'Season is required' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select Season" />
                        </SelectTrigger>
                        <SelectContent>
                          {season.map((season: any) => (
                            <SelectItem key={season._id} value={season._id}>{season.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                </div>
              </div>

              {/* Color */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="color" className="md:w-1/4 font-medium text-gray-700">Color</Label>
                <div className="md:w-3/4">
                  <Controller
                    name="color"
                    control={control}
                    rules={{ required: 'Color is required' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select Color" />
                        </SelectTrigger>
                        <SelectContent>
                          {color.map((color: any) => (
                            <SelectItem key={color._id} value={color._id}>
                              <div className="flex items-center space-x-2">
                                <span
                                  className="inline-block h-4 w-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color.hexCode }}
                                />
                                <span>{color.name}</span>
                              </div>
                            </SelectItem>
                          ))}

                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                </div>
              </div>
              {/* Gender */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="brand"
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  Gender
                </Label>

                <div className="md:w-3/4 w-full">
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value ? String(field.value) : ""}
                        className="flex space-x-4"
                      >
                        {filters.gender.map((gen) => (
                          <div key={gen._id} className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={gen._id}
                              id={gen._id}
                            />
                            <Label htmlFor={gen._id}>{gen.name}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                  )}
                </div>

              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 font-medium text-gray-700">Book Condition</Label>
                <div className="md:w-3/4">
                  <Controller
                    name="condition"
                    control={control}
                    rules={{ required: 'Book condition is required' }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        {filters.condition.map((condition) => (
                          <div key={condition} className="flex items-center space-x-2">
                            <RadioGroupItem value={condition.toLowerCase()} id={condition.toLowerCase()} />
                            <Label htmlFor={condition.toLowerCase()}>{condition}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="subject" className="md:w-1/4 font-medium text-gray-700">For Class</Label>
                <div className="md:w-3/4">
                  <Controller
                    name="classType"
                    control={control}
                    rules={{ required: 'classType is required' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {filters.classType.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.classType && <p className="text-red-500 text-sm mt-1">{errors.classType.message}</p>}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="subject" className="md:w-1/4 font-medium text-gray-700">Book Title/Subject</Label>
                <div className="md:w-3/4">
                  <Input
                    id="subject"
                    placeholder="Enter product name"
                    {...register('subject', { required: 'Book title/subject is required' })}
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="block mb-2 font-medium text-gray-700">Upload Photos</Label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="h-8 w-8 text-blue-500" />
                    <Label
                      htmlFor="images"
                      className="cursor-pointer text-sm text-blue-600 hover:underline"
                    >
                      Click here to upload up to 4 images (Size: 15MB max. each)
                    </Label>
                    <Input
                      id="images"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image}
                            alt={`Book image ${index + 1}`}
                            width={150}
                            height={150}
                            className="rounded-lg object-cover w-full h-32 border border-gray-300"
                          />

                          {/* Optional remove button */}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optional Details */}
          <Card className="shadow-lg border-t-4 border-t-green-500">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="text-2xl text-green-700 flex items-center">
                <HelpCircle className="mr-2 h-6 w-6" />
                Optional Details
              </CardTitle>
              <CardDescription>(Description, MRP, Author, etc...)</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Book Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <Label htmlFor="price" className="md:w-1/4 font-medium text-gray-700">MRP</Label>
                        <Input
                          id="price"
                          placeholder="Enter book MRP"
                          {...register('price', { required: 'mrp is required' })}
                          className="md:w-3/4"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <Label htmlFor="author" className="md:w-1/4 font-medium text-gray-700">Author</Label>
                        <Input
                          id="author"
                          placeholder="Enter book author name"
                          {...register('author')}
                          className="md:w-3/4"
                        />
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <Label htmlFor="edition" className="md:w-1/4 font-medium text-gray-700">Edition (Year)</Label>
                        <Input
                          id="edition"
                          placeholder="Enter book edition year"
                          {...register('edition')}
                          className="md:w-3/4"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Ad Description</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Label htmlFor="description" className="md:w-1/4 mt-2 font-medium text-gray-700">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter ad description"
                        {...register('description')}
                        className="md:w-3/4"
                        rows={4}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Pricing Details */}
          <Card className="shadow-lg border-t-4 border-t-yellow-500">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardTitle className="text-2xl text-yellow-700 flex items-center">
                <DollarSign className="mr-2 h-6 w-6" />
                Pricing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label htmlFor="price" className="md:w-1/4 font-medium text-gray-700">Your Price (₹)</Label>
                <div className="md:w-3/4">
                  <Input
                    id="price"
                    placeholder="Enter your ad finalPrice"
                    {...register('finalPrice', { required: 'finalPrice is required' })}
                    className="md:w-3/4"
                  />
                  {errors.finalPrice && <p className="text-red-500 text-sm mt-1">{errors.finalPrice.message}</p>}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 mt-2 font-medium text-gray-700">Shipping Charges</Label>
                <div className="space-y-2 md:w-3/4">
                  <div className="flex items-center gap-4">
                    <Input
                      {...register('shippingCharge')}
                      placeholder="Enter shipping charges"
                      className="w-full md:w-1/2"
                      disabled={watch('shippingCharge') === 'free'}
                    />
                    <span className="text-sm">or</span>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="shippingCharge"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="freeShipping"
                            checked={field.value === 'free'}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? 'free' : '');
                            }}
                          />
                        )}
                      />
                      <Label htmlFor="freeShipping">Free Shipping</Label>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Buyers prefer free shipping or low shipping charges.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-50">
              <CardTitle className="text-2xl text-yellow-600 flex items-center">
                <CreditCard className="mr-2 h-6 w-6" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 mt-2 font-medium text-gray-700">Payment Mode</Label>
                <div className="space-y-2 md:w-3/4">
                  <p className="text-sm text-muted-foreground mb-2">After your book is sold, in what mode would you like to receive the payment?</p>
                  <Controller
                    name="paymentMode"
                    control={control}
                    rules={{ required: 'Payment mode is required' }}
                    render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="UPI" id="upi" {...register('paymentMode')} />
                          <Label htmlFor="upi">UPI Number</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Bank Account" id="bank" {...register('paymentMode')} />
                          <Label htmlFor="bank">Bank Account</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.paymentMode && (
                    <p className="text-red-500 text-sm mt-1">{errors.paymentMode.message}</p>
                  )}
                </div>
              </div>

              {/* Conditional rendering for payment details */}
              {paymentMode === 'UPI' && (
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                  <Label htmlFor="upiId" className="md:w-1/4 font-medium text-gray-700">UPI ID</Label>
                  <Input id="upiId" placeholder="Enter your UPI ID" {...register('paymentDetails.upiId', {
                    required: 'UPI ID is required',
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+$/,
                      message: 'Invalid UPI ID format'
                    }
                  })} />
                  {errors.paymentDetails?.upiId && (
                    <p className="text-red-500 text-sm mt-1">{errors.paymentDetails.upiId.message}</p>
                  )}
                </div>
              )}

              {paymentMode === 'Bank Account' && (
                <>
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label htmlFor="accountNumber" className="md:w-1/4 font-medium text-gray-700">Account Number</Label>
                    <Input id="accountNumber" placeholder="Enter your account number" {...register('paymentDetails.bankDetails.accountNumber', {
                      required: 'Account number is required',
                      pattern: {
                        value: /^\d{9,18}$/, // Adjust based on your requirements
                        message: 'Invalid account number'
                      }
                    })} />
                    {errors.paymentDetails?.bankDetails?.accountNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.paymentDetails.bankDetails.accountNumber.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label htmlFor="ifscCode" className="md:w-1/4 font-medium text-gray-700">IFSC Code</Label>
                    <Input id="ifscCode" placeholder="Enter IFSC code" {...register('paymentDetails.bankDetails.ifscCode', {
                      required: 'IFSC code is required',
                      pattern: {
                        value: /^[A-Z]{4}0[A-Z0-9]{6}$/, // Typical IFSC code format
                        message: 'Invalid IFSC code'
                      }
                    })} />
                    {errors.paymentDetails?.bankDetails?.ifscCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.paymentDetails.bankDetails.ifscCode.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label htmlFor="bankName" className="md:w-1/4 font-medium text-gray-700">Bank Name</Label>
                    <Input id="bankName" placeholder="Enter bank name" {...register('paymentDetails.bankDetails.bankName', {
                      required: 'Bank name is required'
                    })} />
                    {errors.paymentDetails?.bankDetails?.bankName && (
                      <p className="text-red=500 text-sm mt=1">{errors.paymentDetails.bankDetails.bankName.message}</p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading} className="w-60 text-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-orange-600 hover:to-orange-700 font-semibold py-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            {isLoading ?
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Saving...
              </> : 'Post Your Book'}
          </Button>

          <p className="text-sm text-center text-gray-600">
            By clicking "Post Your Book", you agree to our{' '}
            <Link href="/terms-of-use" className="text-blue-500 hover:underline">
              Terms of Use
            </Link>
            ,{' '}
            <Link href="/privacy-policy" className="text-blue-500 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

