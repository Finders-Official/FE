export type Address = {
  id: number;
  address: string;
  // 필요한 필드가 있으면 추가
};

export const mockAddresses: Address[] = [
  { id: 1, address: "서울특별시 흑석동 123-123" },
  { id: 2, address: "서울특별시 흑석동 123-123" },
];
