import mock1 from "@/assets/mocks/mock1.jpg";
import mock2 from "@/assets/mocks/mock2.jpg";
import mock3 from "@/assets/mocks/mock3.jpg";
import mock4 from "@/assets/mocks/mock4.jpg";
import mock5 from "@/assets/mocks/mock5.jpg";

type SearchHistory = {
  historyId: number;
  keyword: string;
  imageUrl: string;
  createdAt: string;
};

export type SearchHistoryList = {
  historyList: SearchHistory[];
};

// mock
export const mockHistoryList: SearchHistoryList = {
  historyList: [
    {
      historyId: 1,
      keyword: "덕수궁 출사",
      imageUrl: mock1,
      createdAt: "2025-01-10T12:00:00",
    },
    {
      historyId: 2,
      keyword: "필름카메라",
      imageUrl: mock2,
      createdAt: "2025-01-10T12:00:00",
    },
    {
      historyId: 3,
      keyword: "초보자",
      imageUrl: mock3,
      createdAt: "2025-01-10T12:00:00",
    },
    {
      historyId: 4,
      keyword: "눈사람",
      imageUrl: mock4,
      createdAt: "2025-01-10T12:00:00",
    },
    {
      historyId: 5,
      keyword: "케이크",
      imageUrl: mock5,
      createdAt: "2025-01-10T12:00:00",
    },
  ],
};
