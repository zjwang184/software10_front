export const treeData = [
  {
    id: "1",
    label: "私有数据集",
    isLeafs: false,
    isCommon: false,
    path: "私有数据集",
    children: [
      {
        id: "1-1",
        label: "糖尿病",
        isLeafs: false,
        isCommon: false,
        path: "糖尿病/一型糖尿病",
        children: [
          {
            id: "1-1",
            label: "一型糖尿病",
            isLeafs: false,
            isCommon: false,
            path: "糖尿病/二型糖尿病",
            children: [
            ],
          },
          {
            id: "1-2",
            label: "二型糖尿病",
            isLeafs: false,
            isCommon: false,
            path: "糖尿病/二型糖尿病",
            children: [
              {
                id: "1780823370439490",
                label: "data_diabetes25",
                isLeafs: true,
              },
              {
                id: "1780823370439487490",
                label: "data_diabetes23",
                isLeafs: true,
              },
              {
                id: "1780828572873891842",
                label: "heart2",
                isLeafs: true,
              },
              {
                id: "16485749691",
                label: "diabetes10",
                isLeafs: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "共享数据集",
    isLeafs: false,
    isCommon: false,
    path: "胃病",
    children: [
      {
        id: "2-1",
        label: "胃病",
        isLeafs: true,
        children: [
          {
            id: "2-1-1",
            label: "胃肿瘤",
            isLeafs: true,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    label: "公共数据集",
    isLeafs: false,
    isCommon: true,
    path: "公共数据集",
    children: [
      {
        id: "2-1",
        label: "胃病",
        isLeafs: true,
        children: [
          {
            id: "2-1-1",
            label: "胃肿瘤",
            isLeafs: true,
            children: [],
          },
        ],
      },
    ],
  },
];
