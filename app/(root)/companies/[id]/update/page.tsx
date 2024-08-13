import CompaniesForm from "@/components/shared/CompaniesForm"
import { getCompanyById } from "@/lib/actions/company.actions";
import { UpdateCompanyParams } from "@/types";
import { auth } from "@clerk/nextjs/server"

type UpdateCompanyProps = {
  params: {
    id: string
  }
}

const UpdateCompany = async ({ params: { id }}: UpdateCompanyProps) => {
    

    const { sessionClaims } = auth();

    const userId = sessionClaims?.userId as string;

    const company = await getCompanyById(id)
    const initialCategoryIds = company.categories.map((cat: any) => cat._id)
    const initialFundingTypeIds = company.fundingTypes.map((ft: any) => ft._id)

  return (
    <><section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
          <h3 className="wrapper h3-bold text-center sm:text-left">Update Company Details</h3>
    </section>
      
      <div className='wrapper my-8'>
       <CompaniesForm 
       userId={userId} 
       type="Update" 
       company={company} 
       companyId={company._id}
       initialCategoryIds={initialCategoryIds}
       initialFundingTypeIds={initialFundingTypeIds}
       />    
    </div>
    </>
  )
}

export default UpdateCompany  