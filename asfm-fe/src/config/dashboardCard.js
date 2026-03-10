import {Users , PawPrint, User} from 'lucide-react';

export const DASHBOARD_CARD_CONFIG = [
  {
    id: "all-users",
    title: "All Users",
    dataKey: "totalUsers",
    subtitle: "Registered accounts",
    icon : User
  },
  {
    id: "all-animals",
    title: "All Animals",
    dataKey: "totalAnimals",
    subtitle: "Active animal records",
    icon : PawPrint
  },
];