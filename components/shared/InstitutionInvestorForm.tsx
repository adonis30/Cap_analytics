"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { FileUploader } from "./FileUploader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import MultiSelect from "./MultiSelect";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getAllFundingTypes } from "@/lib/actions/fundingType.actions";
import { useAuth } from "@clerk/nextjs";
import { createInvestor, fetchCompanies } from "@/lib/actions/investor.actions";
import { useUploadThing } from "@/lib/uploadthing";
import { institutionInvestorSchema as investorSchema } from "@/lib/investor.validator";
import { BackgroundGradient } from "../ui/background-gradient";

interface InstitutionInvestorFormProps {
  userId: string;
  initialCategoryIds: string[];
  initialFundingTypeIds: string[];
  type: "Create" | "Update";
}

const InstitutionInvestorForm: React.FC<InstitutionInvestorFormProps> = ({
  initialCategoryIds,
  initialFundingTypeIds,
}) => {
  const { userId: authUserId } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<{ _id: string; organizationName: string }[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [fundingTypeOptions, setFundingTypeOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof investorSchema>>({
    resolver: zodResolver(investorSchema),
    defaultValues: {
      type: "Institution",
      name: "",
      email: "",
      phoneNumber: "",
      totalAmountFunded: 0,
      highestAmountFunded: 0,
      fundingTypes: initialFundingTypeIds,
      fundedCompanies: [],
      institutionDetails: {
        organizationName: "",
        description: "",
        website: "",
        contactNumber: 0,
        address: "",
        categories: initialCategoryIds,
        contactEmail: "",
        location: "",
        imageUrl: "",
      },
    },
  });

  // Fetch data for companies, funding types, and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const [fetchedCompanies, fundingTypes, categories] = await Promise.all([
          fetchCompanies(),
          getAllFundingTypes(),
          getAllCategories(),
        ]);

        setCompanies(
          fetchedCompanies.map((company: any) => ({
            _id: company.value || company._id,
            organizationName: company.label || company.organizationName,
          }))
        );

        setFundingTypeOptions(
          fundingTypes.map((type: { _id: string; name: string }) => ({
            value: type._id,
            label: type.name,
          }))
        );

        setCategoryOptions(
          categories.map((category: { _id: string; name: string }) => ({
            value: category._id,
            label: category.name,
          }))
        );
      } catch (error) {
        toast.error("Error fetching data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update form values with uploaded image
  useEffect(() => {
    if (files.length > 0) {
      form.setValue("institutionDetails.imageUrl", URL.createObjectURL(files[0]));
    }
  }, [files, form]);

  const onSubmit = async (values: z.infer<typeof investorSchema>) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting values:", values);
      toast.info("Submitting form...");

      let imageUrl = values.institutionDetails?.imageUrl;

      if (files.length > 0) {
        const uploadedImages = await startUpload(files);
        if (uploadedImages && uploadedImages[0]?.url) {
          imageUrl = uploadedImages[0].url;
        }
      }

      const investorData = {
        ...values,
        institutionDetails: {
          ...values.institutionDetails,
          imageUrl,
        },
        userId: authUserId,
      };

      await createInvestor(investorData);

      toast.success("Investor created successfully!");
      router.push("/investors");
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
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
            <CardTitle>Create Institution Investor</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
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
              name="institutionDetails.imageUrl"
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
              name="institutionDetails.organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institutionDetails.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institutionDetails.website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter website" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institutionDetails.contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" 
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
              name="institutionDetails.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institutionDetails.contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institutionDetails.location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institutionDetails.categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <MultiSelect
                      defaultValue={field.value}
                      onValueChange={(newValue) => field.onChange(newValue)}
                      placeholder="Select categories"
                      options={categoryOptions}
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
                    <Input placeholder="Total amount funded" {...field} 
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
                    <Input placeholder="Highest amount funded" {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
    </BackgroundGradient>
  );
};

export default InstitutionInvestorForm;
