import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name_en: { type: String, required: true },
  name_am: { type: String, required: true },
  description_en: { type: String, required: true },
  description_am: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: "" },
  isSpecial: { type: Boolean, default: false },
  isSoldOut: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  clicks: { type: Number, default: 0 },
  cartAdds: { type: Number, default: 0 }
});

const MenuSectionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  category_en: { type: String, required: true },
  category_am: { type: String, required: true },
  items: [MenuItemSchema]
});

const SettingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'global' },
  hotelName: { type: String, default: 'ABAY HOTEL' },
  hotelSlogan: { type: String, default: 'PREMIUM LUXURY DINING' },
  logo: { type: String, default: '/logo.svg' },
  storyTitle: { type: String, default: 'The Essence of Ethiopia' },
  storyText: { type: String, default: '' },
  address: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  adminPassword: { type: String, default: 'admin123' },
  adminEmail: { type: String, default: 'admin@abayhotel.com' },
  resetOtp: { type: String, default: null },
  resetOtpExpiry: { type: Date, default: null },
  totalViews: { type: Number, default: 0 },
  dailyViews: { type: Number, default: 0 },
  lastViewReset: { type: String, default: "" }
});

export const MenuSection = mongoose.models.MenuSection || mongoose.model('MenuSection', MenuSectionSchema);
export const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

// --- Main Website Manager Models ---

const MainSiteProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Coffee', 'Cake'], required: true },
  subCategory: { type: String, required: true }, // Reference to sub-category name
  price: { type: Number, required: true },
  description: { type: String, maxlength: 200 },
  image: { type: String, required: true },
  leadTime: { type: String, default: '' }, // e.g., 'Order 3 days in advance'
  ingredients: { type: String, default: '' }, // Detailed text area
  sizeWeight: { type: String, default: '' }, // e.g., '500g', '2kg', '12 Slices'
  shelfLife: { type: String, default: '' }, // For packed goods
  createdAt: { type: Date, default: Date.now }
});

const SubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentSection: { type: String, enum: ['Coffee', 'Cake'], required: true },
  coverImage: { type: String, required: true }, // Cloudinary image URL
  createdAt: { type: Date, default: Date.now }
});

const SiteSettingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'site_settings' },
  mapLatitude: { type: String, default: "" },
  mapLongitude: { type: String, default: "" },
  lastUpdated: { type: Date, default: Date.now }
});

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MainHeroSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const LookbookItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ContactInquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

export const MainSiteProduct = mongoose.models.MainSiteProduct || mongoose.model('MainSiteProduct', MainSiteProductSchema, 'main_site_products');
export const SubCategory = mongoose.models.SubCategory || mongoose.model('SubCategory', SubCategorySchema, 'sub_categories');
export const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema, 'site_settings');
export const Event = mongoose.models.Event || mongoose.model('Event', EventSchema, 'main_site_events');
export const MainHero = mongoose.models.MainHero || mongoose.model('MainHero', MainHeroSchema, 'main_site_hero');
export const LookbookItem = mongoose.models.LookbookItem || mongoose.model('LookbookItem', LookbookItemSchema, 'main_site_lookbook');
export const ContactInquiry = mongoose.models.ContactInquiry || mongoose.model('ContactInquiry', ContactInquirySchema, 'contact_inquiries');

// Keep existing models for Cafe Menu backward compatibility
const AnnouncementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const LookbookCategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true }
});

const InquirySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

export const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
export const LookbookCategory = mongoose.models.LookbookCategory || mongoose.model('LookbookCategory', LookbookCategorySchema);
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
