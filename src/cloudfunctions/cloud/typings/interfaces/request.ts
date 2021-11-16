export interface UpdateApplicationRequest {
  requestId: string;
  action: 'approve' | 'deny';
}

export interface UpdateApplicationResult {
  _id: string;
}
