export const headerLinks = [
    {
      label: 'Home',
      route: '/',
    },
    {
      label: 'Businesses',
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
        label: 'Reports and Analytics',
        route: '/reports',
      },
      
      {
        label: 'Contact Us',
        route: '/about',
      },
  ]
  
  export const companiesDefaultValues = {
    organizationName: '',
    description: '',
    industries: '',
    owners: '',
    rankCompany: '',
    operatingStatus: '',
    contactNumber: '',
    contactEmail: '',
    numberOfSubOrgs: '',
    location: '',
    imageUrl: '',
    fundedDate: null,
    url: '',
    categories: [],
    people: [],
    fundedBy: [],
    fundingTypes: [],
    companyCreator: undefined,
    boardMembers: []
  }