import { iCloudPlan } from '@/types';
import { parseStorageToBytes } from '@/lib/utils';

export const icloudPlans: iCloudPlan[] = [
  {
    id: '5gb',
    storage: '5GB',
    storageBytes: parseStorageToBytes('5GB'),
    isFree: true,
  },
  {
    id: '50gb',
    storage: '50GB',
    storageBytes: parseStorageToBytes('50GB'),
    isFree: false,
  },
  {
    id: '200gb',
    storage: '200GB',
    storageBytes: parseStorageToBytes('200GB'),
    isFree: false,
    supportsFamilySharing: true,
  },
  {
    id: '2tb',
    storage: '2TB',
    storageBytes: parseStorageToBytes('2TB'),
    isFree: false,
    supportsFamilySharing: true,
  },
  {
    id: '6tb',
    storage: '6TB',
    storageBytes: parseStorageToBytes('6TB'),
    isFree: false,
    supportsFamilySharing: true,
  },
  {
    id: '12tb',
    storage: '12TB',
    storageBytes: parseStorageToBytes('12TB'),
    isFree: false,
    supportsFamilySharing: true,
  },
];

export const getiCloudPlanById = (id: string): iCloudPlan | undefined => {
  return icloudPlans.find((plan) => plan.id === id);
};

export const getPaidPlans = (): iCloudPlan[] => {
  return icloudPlans.filter((plan) => !plan.isFree);
};