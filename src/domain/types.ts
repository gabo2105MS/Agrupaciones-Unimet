import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'student' | 'admin';

export type UserProfile = {
  displayName: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type GroupType = {
  id: string;
  name: string;
  description?: string;
  createdAt: Timestamp;
};

export type Group = {
  id: string;
  typeId: string;
  code: string;
  name: string;
  mission: string;
  vision: string;
  photoUrl?: string;
  isAvailable: boolean;
  memberCount: number;
  leaderName?: string;
  participantNames?: string;
  /** Promedio simple para ranking (feedback) */
  feedbackSum?: number;
  feedbackCount?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Affiliation = {
  id: string;
  userId: string;
  groupId: string;
  joinedAt: Timestamp;
};

export type Feedback = {
  id: string;
  userId: string;
  groupId: string;
  comment: string;
  createdAt: Timestamp;
};

export type ContributionStatus = 'pending' | 'completed' | 'simulated' | 'failed';

export type Contribution = {
  id: string;
  userId: string;
  groupId: string;
  amount: number;
  currency: string;
  status: ContributionStatus;
  paypalOrderId?: string;
  createdAt: Timestamp;
};

export type PayPalOrderResponse = {
  orderId: string;
  /** URL a abrir en navegador o WebView */
  approvalUrl: string;
};
