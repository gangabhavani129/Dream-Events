import { Category, Decoration, GalleryItem, Booking, BusinessSettings } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-wedding', name: 'Wedding', description: 'Grand wedding stages and traditional floral arrangements', display_order: 1, active: true },
  { id: 'cat-wedding-stage', name: 'Wedding Stage', description: 'Grand floral stages with luxury backdrops and sofa seating', display_order: 2, active: true },
  { id: 'cat-wedding-mandap', name: 'Wedding Mandap', description: 'Traditional Vedic & contemporary South Indian floral mandaps', display_order: 3, active: true },
  { id: 'cat-reception-stage', name: 'Reception Stage', description: 'Modern aesthetic stages with imported flowers and mood lighting', display_order: 4, active: true },
  { id: 'cat-floral-backdrop', name: 'Floral Backdrop', description: 'Lush flower walls, arches and photo booth backdrops', display_order: 5, active: true },
  { id: 'cat-entrance-decoration', name: 'Entrance Decoration', description: 'Grand welcoming arches, walkway floral pillars & diyas', display_order: 6, active: true },
  { id: 'cat-engagement', name: 'Engagement', description: 'Romantic pastel stages and ring ceremony decors', display_order: 7, active: true },
  { id: 'cat-engagement-stage', name: 'Engagement Stage', description: 'Romantic stages with fairy lights and exotic blooms', display_order: 8, active: true },
  { id: 'cat-ring-ceremony', name: 'Ring Ceremony', description: 'Minimalist and grand ring exchange floral stages', display_order: 9, active: true },
  { id: 'cat-couple-stage', name: 'Couple Stage', description: 'Aesthetic photo-ready couple stages', display_order: 10, active: true },
  { id: 'cat-haldi', name: 'Haldi', description: 'Vibrant yellow marigold, genda phool and URLI setups', display_order: 11, active: true },
  { id: 'cat-mehendi', name: 'Mehendi', description: 'Colorful bohemian, floral swings and drape arrangements', display_order: 12, active: true },
  { id: 'cat-birthday', name: 'Birthday', description: 'Themed birthday setups with balloons and fresh flowers', display_order: 13, active: true },
  { id: 'cat-birthday-stage', name: 'Birthday Stage', description: 'Creative birthday backdrops with LED neon name signage', display_order: 14, active: true },
  { id: 'cat-balloon-decoration', name: 'Balloon Decoration', description: 'Organic balloon garlands with floral touches', display_order: 15, active: true },
  { id: 'cat-kids-birthday', name: 'Kids Birthday', description: 'Whimsical theme decorations for kids celebrations', display_order: 16, active: true },
  { id: 'cat-first-birthday', name: 'First Birthday', description: 'Milestone 1st birthday pastel & teddy floral setups', display_order: 17, active: true },
  { id: 'cat-baby-events', name: 'Baby Events', description: 'Special decor for arrival celebrations', display_order: 18, active: true },
  { id: 'cat-baby-shower', name: 'Baby Shower', description: 'Seemantham / Godh Bharai floral setups and floral swing', display_order: 19, active: true },
  { id: 'cat-naming-ceremony', name: 'Naming Ceremony', description: 'Barasala / Namakaranam cradle floral decor', display_order: 20, active: true },
  { id: 'cat-cradle-ceremony', name: 'Cradle Ceremony', description: 'Traditional wooden cradle adorned with jasmine and roses', display_order: 21, active: true },
  { id: 'cat-housewarming', name: 'Housewarming', description: 'Gruhapravesam traditional marigold door torans and pooja mandap', display_order: 22, active: true },
  { id: 'cat-anniversary', name: 'Anniversary', description: 'Romantic candlelit & exotic flower evening setups', display_order: 23, active: true },
  { id: 'cat-traditional', name: 'Traditional', description: 'Authentic Indian pooja, temple and festival decorations', display_order: 24, active: true },
  { id: 'cat-custom', name: 'Custom Decoration', description: 'Tailored event concept created as per customer vision', display_order: 25, active: true },
];

export const INITIAL_DECORATIONS: Decoration[] = [
  {
    id: 'dec-01',
    category_id: 'cat-wedding-stage',
    category_name: 'Wedding Stage',
    name: 'Royal Rose Wedding Stage',
    description: 'Premium floral wedding stage featuring thousands of hand-selected Dutch red roses, fragrant white carnations, grand gold Roman pillars, and soft warm ambient LED chandeliers.',
    min_price: 25000,
    max_price: 40000,
    price_display_type: 'Price Range',
    included_items: [
      '24ft x 12ft Grand floral backdrop with fresh red roses',
      '2 Royal maharaja chairs / luxury couple sofa',
      '6 Golden Roman accent pillars with cascading bouquets',
      'Warm LED focus lights (12 units) + stage footlights',
      'Carpet flooring (Red / Gold)',
      'Stage flower border runner (24ft)'
    ],
    customization_options: [
      'Flower color switch: Pastel pink & cream roses',
      'Backdrop size extension up to 40ft',
      'Cold pyro fireworks for entry (Optional add-on)',
      'Brass Urli with floating rose petals at stage corners'
    ],
    setup_duration: '5 to 6 hours prior to event',
    active: true,
    featured: true,
    images: [
      {
        id: 'img-01-1',
        decoration_id: 'dec-01',
        image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: true
      },
      {
        id: 'img-01-2',
        decoration_id: 'dec-01',
        image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        display_order: 2,
        is_primary: false
      },
      {
        id: 'img-01-3',
        decoration_id: 'dec-01',
        image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
        display_order: 3,
        is_primary: false
      }
    ]
  },
  {
    id: 'dec-02',
    category_id: 'cat-wedding-stage',
    category_name: 'Wedding Stage',
    name: 'Pink Floral Pastel Wedding Stage',
    description: 'Contemporary fairy-tale stage setup decorated with imported hydrangea, English tea roses, blush carnations, baby’s breath and sheer ivory draping with crystal hangings.',
    min_price: 35000,
    max_price: 55000,
    price_display_type: 'Price Range',
    included_items: [
      '30ft Curved pastel backdrop with dense hydrangeas and blush roses',
      'Velvet upholstered shell sofa in champagne gold',
      'Hanging crystal chandeliers with cascading wisteria',
      'Stage skirting with lush baby breath clouds',
      '16 Programmable warm ambient focus lights'
    ],
    customization_options: [
      'Customized acrylic LED initials of the couple',
      'Full fresh flower upgrade with imported Lilies & Orchids',
      'Curved staircase floral decoration'
    ],
    setup_duration: '6 to 7 hours prior to event',
    active: true,
    featured: true,
    images: [
      {
        id: 'img-02-1',
        decoration_id: 'dec-02',
        image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: true
      },
      {
        id: 'img-02-2',
        decoration_id: 'dec-02',
        image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
        display_order: 2,
        is_primary: false
      }
    ]
  },
  {
    id: 'dec-03',
    category_id: 'cat-wedding-mandap',
    category_name: 'Wedding Mandap',
    name: 'Traditional Marigold Vedic Mandap',
    description: 'Authentic 4-pillar traditional Kalyana Mandap woven with fresh yellow and orange marigold garlands, sacred coconut leaf thoranams, bell hangings, and pure jasmine chains.',
    min_price: 28000,
    max_price: 45000,
    price_display_type: 'Price Range',
    included_items: [
      '4 Carved wooden / brass finish pillars with full marigold wrapping',
      'Dense marigold canopy ceiling with traditional temple bell hangings',
      'Havankund (Homa Kunda) setup with protective copper mat',
      'Bride & Groom wooden carved low stools (Peeta) + 4 Parents chairs',
      'Banana tree entrance pair with mango leaf thoranam'
    ],
    customization_options: [
      'Jasmine (Mogra) string canopy upgrade',
      'Lotus flower pool around the mandap base',
      'Traditional brass Diya stands (Samai) on all 4 corners'
    ],
    setup_duration: '5 hours prior to Muhurtham',
    active: true,
    featured: true,
    images: [
      {
        id: 'img-03-1',
        decoration_id: 'dec-03',
        image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: true
      },
      {
        id: 'img-03-2',
        decoration_id: 'dec-03',
        image_url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
        display_order: 2,
        is_primary: false
      }
    ]
  },
  {
    id: 'dec-04',
    category_id: 'cat-reception-stage',
    category_name: 'Reception Stage',
    name: 'Elegant Reception Glamour Stage',
    description: 'Ultra-luxurious reception stage with geometrical golden arches, cascading white orchids, rich green foliage, LED string waterfall backdrop, and premium lounge sofa.',
    min_price: 40000,
    max_price: 65000,
    price_display_type: 'Price Range',
    included_items: [
      'Geometrical 3-ring golden metal arches with white dendrobium orchids',
      'Fairy light curtain backdrop (30ft wide)',
      'Modern Italian velvet couple loveseat in emerald/gold',
      'Dry-ice smoke machine for couple grand entry',
      '18 Dimmable warm spotlights and stage uplighting'
    ],
    customization_options: [
      'Personalized 3D LED backlit couple monogram',
      'Aisle floral pillars with mirrored carpet walkway',
      'Champagne glass pyramid table decor'
    ],
    setup_duration: '6 hours prior to reception',
    active: true,
    featured: true,
    images: [
      {
        id: 'img-04-1',
        decoration_id: 'dec-04',
        image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: true
      },
      {
        id: 'img-04-2',
        decoration_id: 'dec-04',
        image_url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
        display_order: 2,
        is_primary: false
      }
    ]
  },
  {
    id: 'dec-05',
    category_id: 'cat-birthday-stage',
    category_name: 'Birthday Stage',
    name: 'Birthday Balloon & Floral Arc Stage',
    description: 'Modern organic pastel balloon garland blended with fresh carnations, customized neon "Happy Birthday" board, wooden backdrop arches, and dessert cake plinths.',
    min_price: 12000,
    max_price: 22000,
    price_display_type: 'Price Range',
    included_items: [
      '3 Nested arched wooden backdrops in customized pastel colors',
      '18ft Dual-tone organic balloon garland (matte + metallic)',
      'Neon "Happy Birthday" LED light board',
      '3 Cylinder cake stands / dessert plinths',
      'Spot LED lighting for cake-cutting area'
    ],
    customization_options: [
      'Custom kid’s name LED neon acrylic cut-out',
      'Themed 3D cartoon/superhero or floral cut-outs',
      'Balloon entry gate arch'
    ],
    setup_duration: '3 to 4 hours',
    active: true,
    featured: true,
    images: [
      {
        id: 'img-05-1',
        decoration_id: 'dec-05',
        image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: true
      },
      {
        id: 'img-05-2',
        decoration_id: 'dec-05',
        image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
        display_order: 2,
        is_primary: false
      }
    ]
  },
  {
    id: 'dec-06',
    category_id: 'cat-kids-birthday',
    category_name: 'Kids Birthday',
    name: 'Princess Fairytale Birthday Setup',
    description: 'Dreamy pink and gold princess themed birthday setup with floral carriage cut-out, shimmering sequin wall, pastel flower arrangements, and royal crown motif.',
    min_price: 15000,
    max_price: 28000,
    price_display_type: 'Price Range',
    included_items: [
      'Pink shimmer sequin wall backdrop (16ft x 8ft)',
      'Floral carriage photo booth prop with flower garlands',
      'Royal Princess Throne Chair for the birthday child',
      'Balloon clouds with star and moon foil balloons',
      'Cake table with floral table runner and plinths'
    ],
    customization_options: [
      'Theme customization (Barbie, Frozen, Cinderella)',
      'Tattoo artist / Balloon twisting stall arrangement'
    ],
    setup_duration: '3.5 hours',
    active: true,
    featured: false,
    images: [
      {
        id: 'img-06-1',
        decoration_id: 'dec-06',
        image_url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: true
      }
    ]
  },
  {
    id: 'dec-07',
    category_id: 'cat-first-birthday',
    category_name: 'First Birthday',
    name: 'First Birthday Floral Teddy Setup',
    description: 'Adorable milestone first birthday setup with giant life-size floral teddy bear, giant LED "ONE" marquee letters, soft baby-breath clouds, and pastel balloons.',
    min_price: 18000,
    max_price: 30000,
    price_display_type: 'Price Range',
    included_items: [
      'Giant 3ft illuminated marquee letters spelling "ONE"',
      'Lush flower wall with baby-breath and pastel spray roses',
      '4ft Life-size floral faux teddy bear prop',
      'Pastel balloon garland arch framing the backdrop',
      'Acrylic personalized milestone photo board of 12 months'
    ],
    customization_options: [
      'Boy theme (Pastel Blue & White) or Girl theme (Pastel Peach & Pink)',
      'Customized milestone board with child photos printed'
    ],
    setup_duration: '4 hours',
    active: true,
    featured: false,
    images: [
      {
        id: 'img-07-1',
        decoration_id: 'dec-07',
        image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: true
      }
    ]
  },
  {
    id: 'dec-08',
    category_id: 'cat-engagement-stage',
    category_name: 'Engagement Stage',
    name: 'Engagement Floral Infinity Ring Stage',
    description: 'Enchanting circular infinity ring floral arch surrounded by fresh exotic orchids, blush roses, eucalyptus foliage, Edison vintage bulb hangings, and designer seating.',
    min_price: 22000,
    max_price: 38000,
    price_display_type: 'Price Range',
    included_items: [
      '8ft Diameter metallic circular arch decorated with dense flowers',
      'Neon "Better Together" / "Engaged" LED sign board',
      'Modern dual-seater shell sofa in soft ivory velvet',
      '10 Hanging vintage Edison warm bulbs',
      'Mirror finish carpet walkway (15ft)'
    ],
    customization_options: [
      'Ring platter presentation table with matching floral ring',
      'Smoke effect during ring exchange moment'
    ],
    setup_duration: '4 to 5 hours',
    active: true,
    featured: true,
    images: [
      {
        id: 'img-08-1',
        decoration_id: 'dec-08',
        image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: true
      }
    ]
  },
  {
    id: 'dec-09',
    category_id: 'cat-haldi',
    category_name: 'Haldi',
    name: 'Haldi Yellow Flower Urli Setup',
    description: 'Traditional energetic Haldi ceremony setup with a grand 4ft brass Urli for the bride/groom, dense marigold curtains, handcrafted yellow kites, and sunflower borders.',
    min_price: 16000,
    max_price: 26000,
    price_display_type: 'Price Range',
    included_items: [
      'Large 4ft hammered brass finish Urli for seating',
      'Yellow and orange marigold backdrop (12ft x 8ft)',
      'Handcrafted traditional parasols / umbrellas with flower tassels',
      '2 Brass Samai tall lamps with floating flower diyas',
      '4 Cushion seating diwans for family'
    ],
    customization_options: [
      'Sunflower and yellow gerbera flower upgrades',
      'Floral jewellery set for bride (Necklace, earrings, maang tikka)',
      'Phoolon ki Holi flower petal baskets (5kg fresh petals)'
    ],
    setup_duration: '3.5 hours',
    active: true,
    featured: true,
    images: [
      {
        id: 'img-09-1',
        decoration_id: 'dec-09',
        image_url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: true
      }
    ]
  },
  {
    id: 'dec-10',
    category_id: 'cat-mehendi',
    category_name: 'Mehendi',
    name: 'Mehendi Bohemian Floral Swing Setup',
    description: 'Festive colourful Mehendi decor with a decorated traditional wooden floral swing (Jhula), multicolor vibrant drapes, marigold hangings, and Rajasthani pom-pom tassels.',
    min_price: 18000,
    max_price: 32000,
    price_display_type: 'Price Range',
    included_items: [
      'Heavy wooden Jhula (Swing) loaded with marigolds and rose strings',
      'Multicolor chiffon draped backdrop with fairy lights',
      'Boho dreamcatchers and brass temple bells hanging',
      '4 Low floor seating mattresses with colorful Rajasthani bolster pillows',
      'Decorative Mehendi tray table setup'
    ],
    customization_options: [
      'Custom printed bridal Mehendi photo backdrop banner',
      'Bangle & Bindi giveaway stall decoration'
    ],
    setup_duration: '4 hours',
    active: true,
    featured: false,
    images: [
      {
        id: 'img-10-1',
        decoration_id: 'dec-10',
        image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: true
      }
    ]
  },
  {
    id: 'dec-11',
    category_id: 'cat-baby-shower',
    category_name: 'Baby Shower',
    name: 'Baby Shower Floral Jhula & Cradle Setup',
    description: 'Serene Seemantham / Godh Bharai decoration with pure white jasmine, yellow sevvanthi, lotus buds, auspicious banana trunks, and a decorated mother-to-be floral swing.',
    min_price: 14000,
    max_price: 24000,
    price_display_type: 'Price Range',
    included_items: [
      'Traditional green leaf & flower wall backdrop (12ft x 8ft)',
      'Floral decorated swing (Jhula) for mother-to-be',
      'Silver / brass pooja thali set decoration',
      'Brass urli with fresh lotus flowers and floating candles',
      'Welcome easel stand with custom printed welcome poster'
    ],
    customization_options: [
      'Fresh flower jewelry set for mother-to-be',
      'Bangle ceremony decorated archway'
    ],
    setup_duration: '3.5 hours',
    active: true,
    featured: false,
    images: [
      {
        id: 'img-11-1',
        decoration_id: 'dec-11',
        image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: true
      }
    ]
  },
  {
    id: 'dec-12',
    category_id: 'cat-entrance-decoration',
    category_name: 'Entrance Decoration',
    name: 'Traditional Royal Entrance Arch & Walkway',
    description: 'Grand welcoming entrance with towering floral arch pillars, cascading marigold & jasmine garlands, royal brass standing lamps, and a red carpet passage with flower petal rangoli.',
    min_price: 15000,
    max_price: 28000,
    price_display_type: 'Price Range',
    included_items: [
      '12ft Grand arched floral entrance gate with fresh flowers',
      '4 Standing floral walkway pillars with warm LED spots',
      '30ft Red / Royal Gold aisle carpet',
      'Welcome signage board on wooden easel with flower cluster',
      '2 Brass Samai tall standing lamps'
    ],
    customization_options: [
      'Extension of walkway up to 100ft',
      'Traditional Shehnai / Nadaswaram performance backdrop'
    ],
    setup_duration: '4 hours',
    active: true,
    featured: false,
    images: [
      {
        id: 'img-12-1',
        decoration_id: 'dec-12',
        image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: true
      }
    ]
  },
  {
    id: 'dec-13',
    category_id: 'cat-ring-ceremony',
    category_name: 'Ring Ceremony',
    name: 'Couple Ring Ceremony Dream Stage',
    description: 'Modern fairytale stage with lush white hydrangeas, blush roses, crystal drops, mirrored flooring, and soft amber spot illumination.',
    min_price: 30000,
    max_price: 48000,
    price_display_type: 'Price Range',
    included_items: [
      '20ft x 10ft White & Blush floral wall',
      'Curved luxury couple loveseat in ivory velvet',
      'Mirrored acrylic platform for ring exchange',
      '10 Dimmable LED wash lights'
    ],
    customization_options: [
      'Cold pyro and fog entry machines',
      'Customized neon surname board'
    ],
    setup_duration: '4.5 hours',
    active: true,
    featured: false,
    images: [
      {
        id: 'img-13-1',
        decoration_id: 'dec-13',
        image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: false
      }
    ]
  },
  {
    id: 'dec-14',
    category_id: 'cat-housewarming',
    category_name: 'Housewarming',
    name: 'Gruhapravesam Traditional Flower Setup',
    description: 'Auspicious traditional housewarming decoration with mango leaf and fresh marigold main door toran, pooja mandapam garland decoration, and floor floral rangoli.',
    min_price: 9000,
    max_price: 18000,
    price_display_type: 'Price Range',
    included_items: [
      'Main entrance door heavy marigold and betel leaf toranam',
      'Pooja room mandap garland decoration with jasmine and roses',
      '5ft Vibrant flower petal Rangoli at the threshold',
      'Brass urli with floating fresh flowers and camphor candles'
    ],
    customization_options: [
      'Balcony / terrace railing flower wrapping',
      'Staircase garland running'
    ],
    setup_duration: '2.5 to 3 hours',
    active: true,
    featured: false,
    images: [
      {
        id: 'img-14-1',
        decoration_id: 'dec-14',
        image_url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
        display_order: 1,
        is_primary: false
      }
    ]
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-01',
    title: 'Grand Royal Wedding Mandap',
    description: 'Traditional South Indian wedding mandap with 5,000+ fresh marigold strings and lotus pond.',
    image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Weddings',
    active: true,
    created_at: '2026-06-15T10:00:00Z'
  },
  {
    id: 'gal-02',
    title: 'Pastel Garden Wedding Stage',
    description: 'Blush pink roses, carnations and baby breath with luxury champagne sofa.',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Weddings',
    active: true,
    created_at: '2026-06-20T10:00:00Z'
  },
  {
    id: 'gal-03',
    title: 'Reception Crystal Chandeliers & Orchids',
    description: 'Lush orchid waterfall with ambient fairy lighting and couple platform.',
    image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Stages',
    active: true,
    created_at: '2026-07-02T10:00:00Z'
  },
  {
    id: 'gal-04',
    title: 'Vibrant Haldi Ceremony with Brass Urli',
    description: 'Yellow and marigold festival vibes with brass urns and photo booth.',
    image_url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Traditional',
    active: true,
    created_at: '2026-07-10T10:00:00Z'
  },
  {
    id: 'gal-05',
    title: 'Fairytale First Birthday Decor',
    description: 'Pastel balloons and floral teddy setup for baby Rhea’s milestone birthday.',
    image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Birthdays',
    active: true,
    created_at: '2026-07-18T10:00:00Z'
  },
  {
    id: 'gal-06',
    title: 'Circular Floral Engagement Arch',
    description: 'Infinite love circular arch with imported orchids and warm fairy glows.',
    image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Engagements',
    active: true,
    created_at: '2026-07-25T10:00:00Z'
  },
  {
    id: 'gal-07',
    title: 'Traditional Cradle Ceremony Barasala',
    description: 'Wooden cradle decorated with fresh white jasmine and pink lotus flowers.',
    image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Baby Events',
    active: true,
    created_at: '2026-08-01T10:00:00Z'
  },
  {
    id: 'gal-08',
    title: 'Grand Floral Entrance Gate',
    description: 'Red rose and jasmine arch with tall brass lamps at luxury convention centre.',
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Flower Decorations',
    active: true,
    created_at: '2026-08-05T10:00:00Z'
  }
];

export const INITIAL_BUSINESS_SETTINGS: BusinessSettings = {
  id: 'settings-01',
  business_name: 'Dream Events',
  tagline: 'Crafting Royal & Timeless Celebrations',
  logo_url: '',
  phone: '+91 90641 77811',
  whatsapp: '+91 90641 77811',
  email: 'chnishantpoco123@gmail.com',
  address: 'Door No. 664/5, Khudiram Palli, Aam Bagan, Malancha',
  city: 'Kharagpur',
  pincode: '721301',
  instagram_url: 'https://instagram.com/dreamevents2020',
  facebook_url: 'https://facebook.com/dreamevents2020',
  description: 'Specialists in premium fresh flower decorations, traditional South Indian mandaps, luxury wedding stages, vibrant Haldi & Mehendi setups, and bespoke theme events across the city.',
  working_hours: 'Mon – Sun: 8:00 AM – 9:30 PM',
  currency_symbol: '₹',
  updated_at: new Date().toISOString()
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-01',
    booking_number: 'DEC-2026-00001',
    decoration_id: 'dec-01',
    decoration_name: 'Royal Rose Wedding Stage',
    request_type: 'STANDARD',
    customer_name: 'Ananya Sharma',
    phone: '+91 98490 12345',
    whatsapp: '+91 98490 12345',
    email: 'ananya.sharma@example.com',
    event_type: 'Wedding',
    event_date: '2026-09-18',
    event_time: '18:30',
    guest_count: 650,
    venue_name: 'Royal Palace Convention Centre',
    venue_address: 'Banjara Hills Main Road, Rd Number 12',
    city: 'Hyderabad',
    pincode: '500034',
    indoor_outdoor: 'Indoor',
    venue_contact: 'Manager Rajesh (+91 99887 76655)',
    special_requirements: 'Require extra red rose petals for bride & groom entry aisle. Stage length needs to be 32 feet.',
    reference_image_urls: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
    ],
    estimated_min_price: 25000,
    estimated_max_price: 40000,
    final_quoted_price: 36000,
    status: 'Confirmed',
    admin_notes: 'Spoke with client on WhatsApp. Advance token received via offline transfer. Flower delivery locked for Sep 18 at 10 AM.',
    created_at: '2026-08-01T09:30:00Z',
    updated_at: '2026-08-02T14:20:00Z'
  },
  {
    id: 'book-02',
    booking_number: 'DEC-2026-00002',
    decoration_id: 'dec-09',
    decoration_name: 'Haldi Yellow Flower Urli Setup',
    request_type: 'STANDARD',
    customer_name: 'Rahul Reddy',
    phone: '+91 97000 54321',
    whatsapp: '+91 97000 54321',
    email: 'rahul.reddy@example.com',
    event_type: 'Haldi',
    event_date: '2026-09-17',
    event_time: '10:00',
    guest_count: 120,
    venue_name: 'Green Meadows Farmhouse',
    venue_address: 'Moinabad Road, Chevella',
    city: 'Hyderabad',
    pincode: '501504',
    indoor_outdoor: 'Outdoor',
    venue_contact: 'Caretaker (+91 94400 11223)',
    special_requirements: 'Outdoor poolside garden. Need additional 5kg yellow marigold flower petals for Phoolon ki Holi.',
    reference_image_urls: [],
    estimated_min_price: 16000,
    estimated_max_price: 26000,
    final_quoted_price: 22000,
    status: 'Quotation Sent',
    admin_notes: 'Sent PDF quote on WhatsApp. Client reviewing with family.',
    created_at: '2026-08-05T11:00:00Z',
    updated_at: '2026-08-06T16:00:00Z'
  },
  {
    id: 'book-03',
    booking_number: 'DEC-2026-00003',
    decoration_id: 'dec-05',
    decoration_name: 'Birthday Balloon & Floral Arc Stage',
    request_type: 'STANDARD',
    customer_name: 'Pooja Iyer',
    phone: '+91 91234 56780',
    whatsapp: '+91 91234 56780',
    email: 'pooja.iyer@example.com',
    event_type: 'Birthday',
    event_date: '2026-08-25',
    event_time: '17:00',
    guest_count: 80,
    venue_name: 'Clubhouse Banquet, Cyber Heights',
    venue_address: 'Gachibowli Financial District',
    city: 'Hyderabad',
    pincode: '500032',
    indoor_outdoor: 'Indoor',
    venue_contact: 'Clubhouse Secretary',
    special_requirements: 'Kid name "Aadhya" in LED neon light. Theme colors: Pastel lavender & baby pink.',
    reference_image_urls: [],
    estimated_min_price: 12000,
    estimated_max_price: 22000,
    final_quoted_price: 18500,
    status: 'New Enquiry',
    admin_notes: 'Fresh enquiry received via QR code scan. Need to call customer for color theme confirmation.',
    created_at: '2026-08-11T15:45:00Z',
    updated_at: '2026-08-11T15:45:00Z'
  },
  {
    id: 'book-04',
    booking_number: 'DEC-2026-00004',
    decoration_id: null,
    decoration_name: 'Custom Royal Floral Mandap & Entry Walkway',
    request_type: 'CUSTOM',
    customer_name: 'Suresh Venkat',
    phone: '+91 99444 88776',
    whatsapp: '+91 99444 88776',
    email: 'suresh.v@example.com',
    event_type: 'Engagement',
    event_date: '2026-10-04',
    event_time: '19:00',
    guest_count: 350,
    venue_name: 'Taj Krishna Grand Ballroom',
    venue_address: 'Road No. 1, Banjara Hills',
    city: 'Hyderabad',
    pincode: '500034',
    indoor_outdoor: 'Indoor',
    venue_contact: 'Banquet Team Taj',
    special_requirements: 'Wants full ceiling lotus hanging setup with 3D acrylic couple monogram in gold finish. Has attached Pinterest references.',
    reference_image_urls: [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80'
    ],
    estimated_min_price: 50000,
    estimated_max_price: 85000,
    final_quoted_price: 68000,
    status: 'Awaiting Confirmation',
    admin_notes: 'Custom mockups sent on WhatsApp. Client liked design proposal.',
    created_at: '2026-08-08T14:10:00Z',
    updated_at: '2026-08-09T18:00:00Z'
  }
];
