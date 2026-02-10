
export enum Screen {
  Home = 'home',
  GardenMap = 'garden-map',
  MutualAid = 'mutual-aid',
  Profile = 'profile',
  ActivityDetails = 'activity-details',
  PlantID = 'plant-id',
  ConfirmActivity = 'confirm-activity',
  VolunteerTools = 'volunteer-tools',
  Notifications = 'notifications',
  WikiDetail = 'wiki-detail',
  History = 'history',
  RedeemSuccess = 'redeem-success',
  ActivityList = 'activity-list',
  WikiSearch = 'wiki-search',
  PostRequest = 'post-request',
  HonorWall = 'honor-wall',
  MyOrders = 'my-orders',
  SkillReport = 'skill-report',
  AddressSettings = 'address-settings',
  VolunteerPortal = 'volunteer-portal',
  VolunteerSuccess = 'volunteer-success',
  VolunteerApplications = 'volunteer-applications',
  CreateEvent = 'create-event',
  Scan = 'scan',
  ManualStampEntry = 'manual-stamp-entry',
  Settings = 'settings',
  Login = 'login',
  Privacy = 'privacy'
}

export enum UserRole {
  Resident = 'resident',
  Staff = 'staff',
  Volunteer = 'volunteer'
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  imageUrl: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  cost?: string;
}

export interface PlantingStep {
  step: number;
  action: string;
  description: string;
}

export interface PlantData {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  imageUrl: string;
  sunlight: string;
  water: string;
  growth: string;
  tags: string[];
  plantingGuide: PlantingStep[];
}

export interface PlantInfo {
  name: string;
  scientificName: string;
  description: string;
  careTips: string[];
  sourceType?: 'plant' | 'sound';
}

export interface Transaction {
  id: string;
  label: string;
  type: 'earn' | 'spend';
  date: string;
  val: string;
}
