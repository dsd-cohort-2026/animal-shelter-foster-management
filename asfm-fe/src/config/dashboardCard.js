import {Users , PawPrint, User} from 'lucide-react';

export const DASHBOARD_CARD_CONFIG = [
  {
    id: "all-users",
    title: "All Users",
    fetchKey: "totalUsers",
    subtitle: "Registered accounts",
    icon : User
  },
  {
    id: "all-animals",
    title: "All Animals",
    fetchKey: "totalAnimals",
    subtitle: "Active animal records",
    icon : PawPrint
  },
];