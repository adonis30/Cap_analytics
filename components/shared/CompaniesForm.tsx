"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { companyformSchema } from "@/lib/validator";
import { z } from "zod";
import { companiesDefaultValues } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "./FileUploader";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createCompany, updateCompany } from "@/lib/actions/company.actions";
import { ICompany } from "@/lib/database/models/company.model";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import MultiSelect from "./MultiSelect";
import CustomDatePicker from "./CustomDatePicker";
import { getAllCategories, createCategory } from "@/lib/actions/category.actions";
import { getAllFundingTypes, createFundingType } from "@/lib/actions/fundingType.actions";
import { useUploadThing } from "@/lib/uploadthing";
import { ICategory } from "@/lib/database/models/category.model";
import { IFundingType as FundingType } from "@/lib/database/models/fundingType.model";
import { CreateCompanyParams } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

type ExtendedCreateCompanyParams = CreateCompanyParams & { userId: string };

type CompaniesFormProps = {
  userId: string;
  type: "Create" | "Update";
  company?: ICompany;
  companyId?: string;
  initialCategoryIds: string[];
  initialFundingTypeIds: string[];
};

const CompaniesForm: React.FC<CompaniesFormProps> = ({
  userId,
  type,
  company,
  companyId,
  initialCategoryIds,
  initialFundingTypeIds,
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const logsRef = useRef<string[]>([]);
  const lastActionRef = useRef<string | null>(null);
  const isFirstRender = useRef(true);

  const addLog = useCallback((message: string, action: string) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logMessage = `[${timestamp}] ${message}`;
    
    if (lastActionRef.current !== action) {
      logsRef.current = [...logsRef.current, logMessage];
      setLogs(prevLogs => [...prevLogs, logMessage]);
      lastActionRef.current = action;
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      addLog("Component rendered", 'render');
      isFirstRender.current = false;
    }
  }, []);

  const form = useForm<z.infer<typeof companyformSchema>>({
    resolver: zodResolver(companyformSchema),
    defaultValues: company || {
      ...companiesDefaultValues,
      organizationName: '',
      categoryIds: [],
      industries: '',
      description: '',
      imageUrl: '',
      location: '',
      owners: '',
      rankCompany: '',
      operatingStatus: '',
      fundedDate: new Date(),
      contactNumber: '',
      contactEmail: '',
      numberOfSubOrgs: '',
      url: '',
      peopleIds: [],
      fundedByIds: [],
      fundingTypeIds: [],
      fundingTypes: [],
      fundingAmount: '',
    },
  });

  const { startUpload } = useUploadThing("imageUploader");
  const { userId: authUserId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (files.length > 0) {
      form.setValue('imageUrl', URL.createObjectURL(files[0]));
    }
  }, [files, form]);

  const [isFormValid, setIsFormValid] = useState(false);

  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [fundingTypes, setFundingTypes] = useState<{ value: string; label: string }[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await getAllCategories();
        const fetchedFundingTypes = await getAllFundingTypes();
        
        setCategories(fetchedCategories.map((cat: ICategory) => ({ value: cat._id, label: cat.name })));
        setFundingTypes(fetchedFundingTypes.map((ft: FundingType) => ({ value: ft._id, label: ft.name })));
      } catch (error) {
        toast.error('Error loading form data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const isValid = [
        'organizationName',
        'description',
        'categoryIds',
        'industries',
        'location',
      ].every(field => {
        const val = value[field as keyof typeof value];
        return val && (
          typeof val === 'string' ? val.length > 0 : 
          Array.isArray(val) ? val.length > 0 : 
          val instanceof Date ? true : 
          false
        );
      });

      setIsFormValid(isValid);
    });

    return () => subscription.unsubscribe();
  }, [form]);

const onSubmit = async (values: z.infer<typeof companyformSchema>) => {
   /*  
    setIsSubmitting(true);
    let imageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);
      if (uploadedImages && uploadedImages[0].url) {
        imageUrl = uploadedImages[0].url;
      }
    }

    const cleanedValues = {
      ...values,
      imageUrl,
      categoryIds: values.categoryIds || [],
      fundingTypeIds: values.fundingTypeIds || [],
      peopleIds: values.peopleIds || [],
      fundedByIds: values.fundedByIds || [],
    };

    const categoryIds = cleanedValues.categoryIds?.map(cat => 
      typeof cat === 'string' ? cat : (cat as { value: string }).value
    ) || [];

    const companyData = {
      ...cleanedValues,
      categoryIds,
      userId: authUserId!,
        
    };

   /*  const createCompanyParams: ExtendedCreateCompanyParams = {
      userId: authUserId!,
      company: companyData,
      path: '/companies'
    }; */
    
   /*  try {
      if (type === 'Create') {
        await createCompany(createCompanyParams);
        toast.success('Company created successfully!');
      } else {
        await updateCompany({
          userId: authUserId!,
          company: { ...companyData, _id: companyId ?? '' },
          path: '/companies'
        });
        toast.success('Company updated successfully!');
      }
      router.push('/companies');
    } catch (error) {
      toast.error('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
    
    addLog(`Form submitted - type: ${type}`, 'submit');
  }; */ 

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && name in value) {
        const logMessage = `Field "${name}" changed. New value: ${JSON.stringify(value[name as keyof typeof value])}`;
        setLogs(prevLogs => [...prevLogs, logMessage]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleCreateCategory = async (inputValue: string) => {
    const newCategory = await createCategory(inputValue);
    return { value: newCategory.id, label: inputValue };
  };

  const handleCreateFundingType = async (inputValue: string) => {
    const newFundingType = await createFundingType(inputValue);
    return newFundingType;
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{type} Company</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter company description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Logo</FormLabel>
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
                  name="fundedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founded Date</FormLabel>
                      <FormControl>
                        <CustomDatePicker 
                          selected={field.value} 
                          onChange={(date: Date) => field.onChange(date)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories or industry type</FormLabel>
                      <FormControl>
                        <MultiSelect
                          defaultValue={field.value}
                          onValueChange={(newValue) => field.onChange(newValue)}
                          placeholder="Select categories"
                          options={categories}
                          createCategory={handleCreateCategory}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company type</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter industries (min 3 characters)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HQ Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="owners"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owned By</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter owners" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="operatingStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operating Status</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter operating status (min 2 characters)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Website</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter valid URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="financials" className="space-y-4">
                <FormField
                  control={form.control}
                  name="fundingTypeIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Types</FormLabel>
                      <FormControl>
                        <MultiSelect
                          defaultValue={field.value}
                          onValueChange={(newValue) => field.onChange(newValue)}
                          placeholder="Select funding types"
                          options={fundingTypes}
                          createFundingType={handleCreateFundingType}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fundedByIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funded By</FormLabel>
                      <FormControl>
                        <MultiSelect
                          defaultValue={field.value as string[]}
                          onValueChange={(newValue: string[]) => field.onChange(newValue)}
                          placeholder="Select funders"
                          options={[]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fundingAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter funding amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rankCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rank Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter rank company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="contacts" className="space-y-4">
                <FormField
                  control={form.control}
                  name="peopleIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>People</FormLabel>
                      <FormControl>
                        <MultiSelect
                          defaultValue={field.value as string[]}
                          onValueChange={(newValue: string[]) => field.onChange(newValue)}
                          placeholder="Select people"
                          options={[]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Company Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comapany Contact Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfSubOrgs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Sub Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter number of sub-orgs" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            type="submit" 
            className="w-1/3" 
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
          <Button 
            type="button" 
            onClick={() => form.reset()} 
            variant="outline" 
            className="w-1/3"
            disabled={isSubmitting}
          >
            Clear
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompaniesForm;
