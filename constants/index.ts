export const headerLinks = [
    {
      label: 'Home',
      route: '/',
    },
    {
      label: 'Businesses',
      route: '/businesses',
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
        label: 'Events',
        route: '/events',
      },
      {
        label: 'About',
        route: '/about',
      },
  ]
  
  export const eventDefaultValues = {
    title: '',
    description: '',
    location: '',
    imageUrl: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    categoryId: '',
    price: '',
    isFree: false,
    url: '',
  }