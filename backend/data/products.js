const products = [
  // Lubricants
  {
    name: "Mobil 1 Synthetic Motor Oil",
    image: "/images/Lubricants/lub1.webp",
    description:
      "Mobil 1 Synthetic Motor Oil is engineered for outstanding engine performance, providing proven protection from wear even in extreme conditions. Its advanced synthetic formula helps to keep your engine clean, reduce friction, and enhance fuel efficiency. With Mobil 1, you can trust your engine to deliver optimal performance mile after mile.",
    brand: "Mobil",
    category: "Lubricants",
    price: 39.99,
    countInStock: Math.floor(Math.random() * 301) + 200,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Castrol EDGE Full Synthetic Motor Oil",
    image: "/images/Lubricants/lub2.webp",
    description:
      "Castrol EDGE Full Synthetic Motor Oil is designed to give you the confidence to push your engine to its limits. Its advanced formula provides superior protection against engine wear, ensuring maximum performance and reliability. Whether you are on the road or the track, Castrol EDGE has you covered.",
    brand: "Castrol",
    category: "Lubricants",
    price: 49.99,
    countInStock: Math.floor(Math.random() * 301) + 200,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Valvoline High Mileage Motor Oil",
    image: "/images/Lubricants/lub3.webp",
    description:
      "Valvoline High Mileage Motor Oil is specially formulated to rejuvenate aging engines and keep them running smoothly. Its advanced additives help to seal leaks, reduce oil consumption, and restore lost horsepower. With Valvoline, you can extend the life of your engine and keep it running strong for years to come.",
    brand: "Valvoline",
    category: "Lubricants",
    price: 29.99,
    countInStock: Math.floor(Math.random() * 301) + 200,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Pennzoil Platinum Full Synthetic Motor Oil",
    image: "/images/Lubricants/lub4.webp",
    description:
      "Pennzoil Platinum Full Synthetic Motor Oil offers unbeatable protection for your engine. Its unique PurePlus Technology converts natural gas into a pure synthetic base oil, delivering enhanced performance and engine protection. With Pennzoil Platinum, your engine will run cleaner, smoother, and more efficiently.",
    brand: "Pennzoil",
    category: "Lubricants",
    price: 59.99,
    countInStock: Math.floor(Math.random() * 301) + 200,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Shell Rotella T6 Full Synthetic Diesel Engine Oil",
    image: "/images/Lubricants/lub5.webp",
    description:
      "Shell Rotella T6 Full Synthetic Diesel Engine Oil is designed to provide ultimate protection for your diesel engine. Its advanced formula resists viscosity loss and thermal breakdown, ensuring long-lasting performance in the toughest conditions. With Shell Rotella T6, you can keep your diesel engine running smoothly mile after mile.",
    brand: "Shell",
    category: "Lubricants",
    price: 49.99,
    countInStock: Math.floor(Math.random() * 301) + 200,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Royal Purple High Performance Synthetic Motor Oil",
    image: "/images/Lubricants/lub6.webp",
    description:
      "Royal Purple High Performance Synthetic Motor Oil is specially formulated to maximize engine performance and protection. Its advanced additive technology reduces metal-to-metal contact for improved efficiency and power. With Royal Purple, you can unleash the full potential of your engine and experience unmatched performance.",
    brand: "Royal Purple",
    category: "Lubricants",
    price: 69.99,
    countInStock: Math.floor(Math.random() * 301) + 200,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Quaker State Advanced Durability Motor Oil",
    image: "/images/Lubricants/lub7.webp",
    description:
      "Quaker State Advanced Durability Motor Oil offers unbeatable protection for your engine. Its unique formula provides superior resistance to thermal breakdown, ensuring long-lasting performance in all driving conditions. With Quaker State, you can trust your engine to deliver reliable performance mile after mile.",
    brand: "Quaker State",
    category: "Lubricants",
    price: 34.99,
    countInStock: Math.floor(Math.random() * 301) + 200,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Havoline High Mileage Synthetic Blend Motor Oil",
    image: "/images/Lubricants/lub8.webp",
    description:
      "Havoline High Mileage Synthetic Blend Motor Oil is specially formulated to meet the needs of older engines. Its advanced blend of synthetic and conventional base oils helps to reduce oil consumption and minimize engine wear. With Havoline, you can keep your high-mileage engine running smoothly for years to come.",
    brand: "Havoline",
    category: "Lubricants",
    price: 39.99,
    countInStock: Math.floor(Math.random() * 301) + 200,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Lucas Oil High Performance Synthetic Motor Oil",
    image: "/images/Lubricants/lub9.webp",
    description:
      "Lucas Oil High Performance Synthetic Motor Oil is engineered for maximum protection and performance. Its advanced formula resists thermal breakdown and reduces oil consumption, ensuring long-lasting performance in all driving conditions. With Lucas Oil, you can trust your engine to deliver unmatched power and reliability.",
    brand: "Lucas Oil",
    category: "Lubricants",
    price: 49.99,
    countInStock: Math.floor(Math.random() * 301) + 200,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Motul 8100 X-cess Synthetic Engine Oil",
    image: "/images/Lubricants/lub10.webp",
    description:
      "Motul 8100 X-cess Synthetic Engine Oil is specifically designed for high-performance engines. Its advanced formula provides exceptional protection against wear, even under extreme conditions. With Motul 8100 X-cess, you can unleash the full potential of your engine and experience maximum power and performance.",
    brand: "Motul",
    category: "Lubricants",
    price: 54.99,
    countInStock: Math.floor(Math.random() * 301) + 200,
    rating: 0,
    numReviews: 0,
    reviews: []
  },

  // Belts
  {
    name: "Gates Serpentine Belt",
    image: "/images/Belts/belt1.webp",
    description:
      "The Gates Serpentine Belt is engineered for reliable performance in your vehicle. Made from high-quality materials, this belt delivers optimal power transmission and durability. With advanced construction and precise fitment, the Gates Serpentine Belt ensures smooth operation and long-lasting service life for your car’s engine.",
    brand: "Gates",
    category: "Belts",
    price: 29.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Continental Elite Timing Belt Kit",
    image: "/images/Belts/belt2.webp",
    description:
      "The Continental Elite Timing Belt Kit is designed for precise fitment and reliable performance in your vehicle. This kit includes all the components necessary for a complete timing belt replacement, ensuring optimal engine operation and longevity. With Continental Elite, you can trust that your engine will run smoothly and reliably mile after mile.",
    brand: "Continental",
    category: "Belts",
    price: 69.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "ACDelco Professional Serpentine Belt",
    image: "/images/Belts/belt3.webp",
    description:
      "The ACDelco Professional Serpentine Belt is engineered to deliver reliable performance and long service life in your vehicle. Its advanced materials and construction ensure optimal power transmission and durability, even in demanding driving conditions. With ACDelco, you can trust that your engine accessories will operate smoothly and efficiently.",
    brand: "ACDelco",
    category: "Belts",
    price: 39.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Dayco Poly Rib Belt",
    image: "/images/Belts/belt4.webp",
    description:
      "The Dayco Poly Rib Belt is designed for superior performance and durability in your vehicle. Made from advanced materials, this belt provides smooth operation and long service life, even under extreme conditions. With its precision engineering and reliable construction, the Dayco Poly Rib Belt ensures optimal engine performance and efficiency.",
    brand: "Dayco",
    category: "Belts",
    price: 34.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Bando Drive Belt",
    image: "/images/Belts/belt5.webp",
    description:
      "The Bando Drive Belt is engineered for exceptional performance and durability in your vehicle. Its advanced design and construction ensure reliable power transmission and long service life, even in harsh operating conditions. With Bando, you can trust that your engine accessories will operate smoothly and efficiently.",
    brand: "Bando",
    category: "Belts",
    price: 24.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Dayco Timing Belt",
    image: "/images/Belts/belt6.webp",
    description:
      "The Dayco Timing Belt is engineered for precise fitment and reliable performance in your vehicle. Its advanced materials and construction ensure optimal power transmission and durability, even in demanding driving conditions. With Dayco, you can trust that your engine will run smoothly and reliably mile after mile.",
    brand: "Dayco",
    category: "Belts",
    price: 49.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Continental Accessory Drive Belt",
    image: "/images/Belts/belt7.webp",
    description:
      "The Continental Accessory Drive Belt is designed for reliable performance and long service life in your vehicle. Its advanced materials and construction ensure optimal power transmission and durability, even in extreme conditions. With Continental, you can trust that your engine accessories will operate smoothly and efficiently.",
    brand: "Continental",
    category: "Belts",
    price: 19.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "ACDelco Professional Stretch Fit Belt",
    image: "/images/Belts/belt8.webp",
    description:
      "The ACDelco Professional Stretch Fit Belt is engineered for reliable performance and precise fitment in your vehicle. Its advanced materials and construction ensure optimal power transmission and durability, even under extreme conditions. With ACDelco, you can trust that your engine accessories will operate smoothly and efficiently.",
    brand: "ACDelco",
    category: "Belts",
    price: 44.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Bando Timing Belt Kit",
    image: "/images/Belts/belt9.webp",
    description:
      "The Bando Timing Belt Kit is designed for precise fitment and reliable performance in your vehicle. This kit includes all the components necessary for a complete timing belt replacement, ensuring optimal engine operation and longevity. With Bando, you can trust that your engine will run smoothly and reliably mile after mile.",
    brand: "Bando",
    category: "Belts",
    price: 59.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Goodyear Gatorback Belt",
    image: "/images/Belts/belt10.webp",
    description:
      "The Goodyear Gatorback Belt is engineered for superior performance and durability in your vehicle. Its advanced construction and materials ensure reliable power transmission and long service life, even under demanding conditions. With Goodyear, you can trust that your engine accessories will operate smoothly and efficiently.",
    brand: "Goodyear",
    category: "Belts",
    price: 32.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },

  // Batteries
  {
    name: "Optima RedTop Starting Battery",
    image: "/images/Battery/battery1.webp",
    description:
      "The Optima RedTop Starting Battery is designed to deliver high-power cranking ability, faster recharging, and reliable starting power in all weather conditions. With its unique SpiralCell design and AGM technology, this battery provides superior performance and long service life for your vehicle. Trust Optima to keep your car running smoothly and reliably.",
    brand: "Optima",
    category: "Batteries",
    price: 199.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "DieHard Advanced Gold AGM Battery",
    image: "/images/Battery/battery2.webp",
    description:
      "The DieHard Advanced Gold AGM Battery is engineered for reliable starting power and long service life in your vehicle. Its advanced AGM technology provides exceptional performance and durability, even in extreme temperatures and driving conditions. With DieHard, you can trust that your vehicle will start smoothly every time.",
    brand: "DieHard",
    category: "Batteries",
    price: 149.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Bosch Premium Performance Battery",
    image: "/images/Battery/battery3.webp",
    description:
      "The Bosch Premium Performance Battery is designed to deliver reliable starting power and long service life for your vehicle. Its advanced technology and durable construction ensure consistent performance, even in harsh weather conditions. With Bosch, you can trust that your car will start smoothly and reliably every time.",
    brand: "Bosch",
    category: "Batteries",
    price: 129.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "ACDelco Professional Automotive AGM Battery",
    image: "/images/Battery/battery4.webp",
    description:
      "The ACDelco Professional Automotive AGM Battery is engineered for reliable starting power and long service life in your vehicle. Its advanced AGM technology provides exceptional performance and durability, even in extreme conditions. With ACDelco, you can trust that your vehicle will start smoothly and reliably every time.",
    brand: "ACDelco",
    category: "Batteries",
    price: 139.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Exide Edge AGM Sealed Automotive Battery",
    image: "/images/Battery/battery5.webp",
    description:
      "The Exide Edge AGM Sealed Automotive Battery is engineered for superior performance and durability in your vehicle. Its advanced AGM technology provides exceptional starting power and long service life, even in extreme temperatures and driving conditions. With Exide Edge, you can trust that your vehicle will start smoothly and reliably every time.",
    brand: "Exide",
    category: "Batteries",
    price: 159.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Duralast Gold Battery",
    image: "/images/Battery/battery6.webp",
    description:
      "The Duralast Gold Battery is engineered for reliable starting power and long service life in your vehicle. Its advanced construction and materials ensure exceptional performance and durability, even in extreme conditions. With Duralast Gold, you can trust that your car will start smoothly and reliably every time.",
    brand: "Duralast",
    category: "Batteries",
    price: 119.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "DieHard Platinum AGM Battery",
    image: "/images/Battery/battery7.webp",
    description:
      "The DieHard Platinum AGM Battery is engineered for exceptional starting power and long service life in your vehicle. Its advanced AGM technology provides superior performance and reliability, even in extreme temperatures and driving conditions. With DieHard Platinum, you can trust that your car will start smoothly and reliably every time.",
    brand: "DieHard",
    category: "Batteries",
    price: 179.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "ACDelco Advantage Automotive Battery",
    image: "/images/Battery/battery8.webp",
    description:
      "The ACDelco Advantage Automotive Battery is designed for reliable starting power and long service life in your vehicle. Its advanced construction and materials ensure optimal performance and durability, even in harsh conditions. With ACDelco Advantage, you can trust that your car will start smoothly and reliably every time.",
    brand: "ACDelco",
    category: "Batteries",
    price: 99.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Duracell AGM Automotive Battery",
    image: "/images/Battery/battery9.webp",
    description:
      "The Duracell AGM Automotive Battery is engineered for superior performance and reliability in your vehicle. Its advanced AGM technology provides exceptional starting power and long service life, even in extreme temperatures and driving conditions. With Duracell, you can trust that your car will start smoothly and reliably every time.",
    brand: "Duracell",
    category: "Batteries",
    price: 169.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "EverStart Maxx Automotive Battery",
    image: "/images/Battery/battery10.webp",
    description:
      "The EverStart Maxx Automotive Battery is designed for reliable starting power and long service life in your vehicle. Its advanced construction and materials ensure exceptional performance and durability, even in extreme conditions. With EverStart Maxx, you can trust that your car will start smoothly and reliably every time.",
    brand: "EverStart",
    category: "Batteries",
    price: 89.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },

  // Filters
  {
    name: "FRAM Extra Guard Air Filter",
    image: "/images/Filters/filter1.webp",
    description:
      "The FRAM Extra Guard Air Filter is engineered to provide premium engine protection and improved performance for your vehicle. Its advanced filter media traps harmful contaminants, including dust, pollen, and dirt, ensuring clean air flow to the engine. With FRAM, you can trust that your engine will run smoothly and efficiently mile after mile.",
    brand: "FRAM",
    category: "Filters",
    price: 12.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Motorcraft Oil Filter",
    image: "/images/Filters/filter2.webp",
    description:
      "The Motorcraft Oil Filter is designed for superior engine protection and performance in your vehicle. Its advanced filter media traps harmful contaminants, including dirt and debris, ensuring clean oil flow to the engine. With Motorcraft, you can trust that your engine will run smoothly and efficiently mile after mile.",
    brand: "Motorcraft",
    category: "Filters",
    price: 8.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "ACDelco Professional Engine Oil Filter",
    image: "/images/Filters/filter3.webp",
    description:
      "The ACDelco Professional Engine Oil Filter is engineered for reliable engine protection and performance in your vehicle. Its advanced filter media traps harmful contaminants, ensuring clean oil flow to the engine for optimal performance and efficiency. With ACDelco, you can trust that your engine will run smoothly and reliably mile after mile.",
    brand: "ACDelco",
    category: "Filters",
    price: 10.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "WIX Oil Filter",
    image: "/images/Filters/filter4.webp",
    description:
      "The WIX Oil Filter is engineered for superior engine protection and performance in your vehicle. Its advanced filter media traps harmful contaminants, ensuring clean oil flow to the engine for optimal performance and efficiency. With WIX, you can trust that your engine will run smoothly and reliably mile after mile.",
    brand: "WIX",
    category: "Filters",
    price: 9.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "PurolatorONE Advanced Engine Protection Filter",
    image: "/images/Filters/filter5.webp",
    description:
      "The PurolatorONE Advanced Engine Protection Filter is engineered for superior engine protection and performance in your vehicle. Its advanced filter media traps harmful contaminants, ensuring clean oil flow to the engine for optimal performance and efficiency. With PurolatorONE, you can trust that your engine will run smoothly and reliably mile after mile.",
    brand: "Purolator",
    category: "Filters",
    price: 11.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Bosch Premium Oil Filter",
    image: "/images/Filters/filter6.webp",
    description:
      "The Bosch Premium Oil Filter is engineered for superior engine protection and performance in your vehicle. Its advanced filter media traps harmful contaminants, ensuring clean oil flow to the engine for optimal performance and efficiency. With Bosch, you can trust that your engine will run smoothly and reliably mile after mile.",
    brand: "Bosch",
    category: "Filters",
    price: 13.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Hastings Premium Oil Filter",
    image: "/images/Filters/filter7.webp",
    description:
      "The Hastings Premium Oil Filter is engineered for superior engine protection and performance in your vehicle. Its advanced filter media traps harmful contaminants, ensuring clean oil flow to the engine for optimal performance and efficiency. With Hastings, you can trust that your engine will run smoothly and reliably mile after mile.",
    brand: "Hastings",
    category: "Filters",
    price: 14.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Fram Tough Guard Oil Filter",
    image: "/images/Filters/filter8.webp",
    description:
      "The Fram Tough Guard Oil Filter is engineered for superior engine protection and performance in your vehicle. Its advanced filter media traps harmful contaminants, ensuring clean oil flow to the engine for optimal performance and efficiency. With Fram, you can trust that your engine will run smoothly and reliably mile after mile.",
    brand: "Fram",
    category: "Filters",
    price: 15.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "Mann-Filter Oil Filter",
    image: "/images/Filters/filter9.webp",
    description:
      "The Mann-Filter Oil Filter is engineered for superior engine protection and performance in your vehicle. Its advanced filter media traps harmful contaminants, ensuring clean oil flow to the engine for optimal performance and efficiency. With Mann-Filter, you can trust that your engine will run smoothly and reliably mile after mile.",
    brand: "Mann-Filter",
    category: "Filters",
    price: 16.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
  {
    name: "ACDelco Advantage Engine Air Filter",
    image: "/images/Filters/filter10.webp",
    description:
      "The ACDelco Advantage Engine Air Filter is engineered to provide superior engine protection and improved performance for your vehicle. Its advanced filter media traps harmful contaminants, ensuring clean air flow to the engine for optimal combustion and efficiency. With ACDelco Advantage, you can trust that your engine will run smoothly and reliably mile after mile.",
    brand: "ACDelco",
    category: "Filters",
    price: 17.99,
    countInStock: Math.floor(Math.random() * 101) + 50,
    rating: 0,
    numReviews: 0,
    reviews: []
  },
];

export default products;
