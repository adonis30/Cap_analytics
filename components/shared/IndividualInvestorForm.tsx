"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { FileUploader } from "./FileUploader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/lib/uploadthing";
import { individualInvestorSchema as investorSchema } from "@/lib/investor.validator";
import MultiSelect from "./MultiSelect";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getAllFundingTypes } from "@/lib/actions/fundingType.actions";
import { useAuth } from "@clerk/nextjs";
import { createInvestor, fetchCompanies } from "@/lib/actions/investor.actions";
import { BackgroundGradient } from "../ui/background-gradient";

interface IndividualInvestorFormProps {
  userId: string;
  initialCategoryIds: string[];
  initialFundingTypeIds: string[];
  type: string;
}

const IndividualInvestorForm: React.FC<IndividualInvestorFormProps> = ({ initialCategoryIds, initialFundingTypeIds, type }) => {
  const { userId: authUserId } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof investorSchema>>({
    resolver: zodResolver(investorSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      fundedCompanies: [],
      fundingTypes: [],
      totalAmountFunded: 0,
      highestAmountFunded: 0,
      individualDetails: {
        firstName: "",
        lastName: "",
        age: undefined,
        occupation: "",
        bio: "",
        portfolio: "",
        imageUrl: "",
      },
      type: "Individual",
      companyCreator: { _id: authUserId || "" },
    },
  });

  const [companies, setCompanies] = useState<{ _id: string; organizationName: string }[]>([]);
  const [fundingTypeOptions, setFundingTypeOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { startUpload } = useUploadThing("imageUploader");

  // Fetch Companies
  useEffect(() => {
    const fetchCompanyData = async () => {
      const fetchedCompanies = await fetchCompanies();
      setCompanies(
        fetchedCompanies.map((company: any) => ({
          _id: company.value || company._id,
          organizationName: company.label || company.organizationName,
        }))
      );
    };
    fetchCompanyData();
  }, []);

  // Fetch Funding Types
  useEffect(() => {
    const fetchFundingTypes = async () => {
      const types = await getAllFundingTypes();
      setFundingTypeOptions(
        types.map((type: { _id: string; name: string }) => ({
          value: type._id,
          label: type.name,
        }))
      );
    };
    fetchFundingTypes();
  }, []);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getAllCategories();
      setCategoryOptions(
        categories.map((category: { _id: string; name: string }) => ({
          value: category._id,
          label: category.name,
        }))
      );
    };
    fetchCategories();
  }, []);

  // Sync Files to Form
  useEffect(() => {
    if (files.length > 0) {
      form.setValue("individualDetails.imageUrl", URL.createObjectURL(files[0]));
    }
  }, [files, form]);

  const onSubmit = async (values: z.infer<typeof investorSchema>) => {
    toast.info("Submitting...");
    const validationResult = investorSchema.safeParse(values);

    if (!validationResult.success) {
      toast.error("Validation failed.");
      return;
    }

    setIsSubmitting(true);

    let imageUrl = values.individualDetails?.imageUrl;

    if (files.length > 0) {
      try {
        const uploadedImages = await startUpload(files);
        if (uploadedImages?.[0]?.url) {
          imageUrl = uploadedImages[0].url;
        }
      } catch {
        toast.error("Image upload failed.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await createInvestor({ ...values, individualDetails: { ...values.individualDetails, imageUrl }, userId: authUserId });
      toast.success("Investor created successfully!");
      router.push("/investors");
    } catch {
      toast.error("Error creating investor. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading form data...</span>
      </div>
    );
  }


  return (
    <BackgroundGradient className="bg-white" containerClassName="p-8">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Individual Investor</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter investor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Add First Name Field */}
            <FormField
              control={form.control}
              name="individualDetails.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Add Last Name Field */}
            <FormField
              control={form.control}
              name="individualDetails.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="individualDetails.imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <FileUploader 
                      onFieldChange={field.onChange}
                      imageUrl={field.value as string}
                      setFiles={setFiles}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="individualDetails.age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                  <Input
                      type="number"
                      placeholder="Enter age"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="individualDetails.occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter occupation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="individualDetails.bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter bio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="individualDetails.portfolio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter portfolio link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fundedCompanies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funded Companies</FormLabel>
                  <FormControl>
                  <MultiSelect
                    defaultValue={field.value}
                    onValueChange={(newValue) => field.onChange(newValue)}
                    placeholder="Select funded companies"
                    options={companies.map((company) => ({
                      value: company._id,
                      label: company.organizationName,
                    }))}
                  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fundingTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Types</FormLabel>
                  <FormControl>
                  <MultiSelect
                    defaultValue={field.value}
                    onValueChange={(newValue) => field.onChange(newValue)}
                    placeholder="Select funding types"
                    options={fundingTypeOptions}
                  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalAmountFunded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount Funded</FormLabel>
                  <FormControl>
                    <Input type="number" 
                    placeholder="Enter total amount funded" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="highestAmountFunded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highest Amount Funded</FormLabel>
                  <FormControl>
                    <Input type="number" 
                    placeholder="Enter highest amount funded" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Create Investor'}
        </Button>
      </form>
    </Form>
    </BackgroundGradient>
  );
};

export default IndividualInvestorForm;
