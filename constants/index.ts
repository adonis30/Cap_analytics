export const headerLinks = [
    {
      label: 'Home',
      route: '/',
    },
    {
      label: 'companies',
      route: '/companies',
    },
    {
      label: 'Investors',
      route: '/investors',
    },
    {
        label: 'Deals',
        route: '/deals',
      },
      {
        label: 'Blog',
        route: '/blog',
      },
      {
        label: 'Reports',
        route: '/reports',
      },
      
      {
        label: 'About',
        route: '/about',
      },
  ]
  
  export const companiesDefaultValues = {
    organizationName: '',
    industries:'',
    description: '',
    locationHq: '',
    imageUrl: '',
    onwers:'',
    rankCompany:'',
    operatingStatus:'',
    fundedDate:new Date(),
    companyType: '',
    categoryId: '',
    contactNumber: '',
    contactEmail:'',
    numberOfSubOrgs:'',
    url: '',
  }