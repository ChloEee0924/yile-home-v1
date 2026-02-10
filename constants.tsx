
import { Activity, PlantData } from './types';

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: '午后茶歇与太极',
    description: '在中心凉亭享用草本茶，体验柔和的太极运动。',
    time: '今日 下午 3:00',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxfIFZZqTlixdKsvP0NVm00LhV6W16fJEnViqMOgSIdcMbQ6scXV1LtCYXzNP64jxFjIYmPFUSpkyWdMMfTYZdPwImohJORTp0MytE5PNdQ6yks6u1nHhcobVwoCljh9cwOWf3V7d13FmhGW0giGkJXLl51c5-s2dHuWuMwG8-DH4AGIATwmUhzF3jOlrZPRuflaYVNpvcszVUDdxuh00pukFsKI4RMC9E7AjfLpARPINgW9f1uTbLhhhwDCzHxWT_PT28Yka9CHk',
    category: '社区交流'
  },
  {
    id: '2',
    title: '感官花园芳香疗法',
    description: '加入我们，在社区花园中开启一段放松身心的芳香探索之旅。',
    time: '10月24日 上午 10:00',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtjrNmoHcMBPhmzeRluHJRXXaHulzVQRicNepb86LnyzkwAqfhBF3mU_1_09QmK8IFa3q8fiHISrh7_ojsCRLiZhRyf7KJiA3c7lbdz2YtrkZcRmE515KRJvdVVfiAvFk2WyNgZyRT6Ku8Y7ToSTH4t-cqHuH7ltBXMxWTgXA8sf27cYo55AWUVypK8QBk9PhIDDaHd7lI6dhMe4A8fNDUAJrqiEsNW7hzl8xcG5LlX1S4FnMeYZUXbr2ccPKytDHziFL04GMpxfU',
    category: '健康养生',
    rating: 4.8,
    reviewCount: 124,
    cost: '2 积分'
  }
];

export const PLANT_DATABASE: PlantData[] = [
  {
    id: 'p1',
    name: '薄荷',
    scientificName: '辣薄荷 (Mentha × piperita)',
    description: '一种杂交薄荷，具有清新的香气，非常适合泡茶和缓解消化问题。',
    imageUrl: 'https://images.unsplash.com/photo-1628535805500-61d02082269a?q=80&w=600&auto=format&fit=crop',
    sunlight: '半阴',
    water: '每日',
    growth: '快',
    tags: ['助消化', '镇静', '提神'],
    plantingGuide: [
      { step: 1, action: '准备土壤', description: '使用肥沃、疏松的土壤，pH值在6.0到7.0之间。' },
      { step: 2, action: '播种', description: '春季将种子或插条种植在1/4英寸深处。' },
      { step: 3, action: '浇水', description: '保持土壤湿润但不要积水。' }
    ]
  },
  {
    id: 'p2',
    name: '薰衣草',
    scientificName: '薰衣草属 (Lavandula)',
    description: '以其镇静的香气和美丽的紫色花穗而闻名，非常适合放松身心。',
    imageUrl: 'https://images.unsplash.com/photo-1595163102433-286821b0665d?q=80&w=600&auto=format&fit=crop',
    sunlight: '全日照',
    water: '每周',
    growth: '中等',
    tags: ['芳香', '放松', '蜜源植物'],
    plantingGuide: [
      { step: 1, action: '选址', description: '选择每天至少有6小时全日照的地方。' },
      { step: 2, action: '排水', description: '确保花盆有良好的排水孔。' },
      { step: 3, action: '修剪', description: '花期后修剪以保持形态。' }
    ]
  },
  {
    id: 'p3',
    name: '芦荟',
    scientificName: '库拉索芦荟 (Aloe barbadensis miller)',
    description: '芦荟属多肉植物。广泛用于草本医疗。',
    imageUrl: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=600&auto=format&fit=crop',
    sunlight: '散射光',
    water: '每两周',
    growth: '慢',
    tags: ['疗愈', '护肤', '耐寒'],
    plantingGuide: [
      { step: 1, action: '土壤类型', description: '使用仙人掌或多肉植物专用土。' },
      { step: 2, action: '浇水', description: '两次浇水之间让土壤完全干透。' },
      { step: 3, action: '光照', description: '放在窗边，但避免下午的直射阳光。' }
    ]
  }
];

export const IMAGES = {
  AVATAR: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJIOytq2sf11knHZHiadfrIpoIYAcZQiqJlkL7i2G_DlsPRD9gqxB-tjHfC-eDh78luCnTNf_-e-Epf2bvjC5QpMDWePMEuRt5tpTFnJMmZ5cCD57sS-ZrQil7bp244eKuuZ6mE4-OMRuNTDqT6VVC6l17iqqq78PJ3pb4vgXGj8BBJoSuQ4H2k3TUbDpYLT9z-U0n4SMU1k5_wYF3uGsPYl_5T6FRNJ8d-zhpRiwMuk-Eei1l5D9ngo9OkaRaTbmvj6WmQ2i7qvE',
  GARDEN_MAP: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQw1NXdaZn4cLf5YvrfyJvmOFMS8JrarGIRs6Al3apwxzzFhfwg3ORQS3zyb4DmnL3r_Gc90SRPZtKMk1IL72G9hcj37bsW1JxG3xT2HbII2DYxOF4fSB6yzDbQVEWZtolGQm20LdJoNzHz5Dz5K-TLZKiZ4g3525PXoUO3g_0xZb5ZqQ2VaWSKkNHrQKM3c6ArR6FV_FvvtFCdqIVM7KjcoXaX2LhD4XhBLAEDdbiOAWQDQR8IcxC-FtRwMArjnpZbMGWTpK3S_k',
  GARDEN_THUMB: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1nJ7TvvaDlgZ9dZbxdnoq5n-xrLndc_5305kOxVTXY24vdmjZNEY3E6P2MLUCGTx_Zb8ZJXv-JIyT5aaT-5l2ECBgikIsCbmG-J9_sz0DPb6WmXyYy8sUELWxm1ZXb7zl2qwzBX1Rgqa6SAGww4KvBDqJ6rV6D-BSR8INVqSzN35-cJgx0hs-StmTjWzyWg-FaD6vCGjS4QzDbxy0_VJGe4-NXdWl9dmr1exlm-Mcf2GgZyrd6ubzBzPqGXZqdA4SaXAgjJmMf-k',
  PLANT_WIKI: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3ImYTDcQWW4rqqldl0ckrvH4f63Hdt8uwScSQ0-aepdRRmWG4dBDqwnHHzsXgTIdxsclMrgWiE09XqsXANBv1hfIEAy0mhNUon6FTNugKDxoSUE9kWsvaXIyMybIz1-fvVVXMxU3QZyu_iP_R-uM3e-6K-IoTydS1TOr7Buq93VeXBZaN-T4fSg1lwRZ42XYRac8CDPNOMKsnSMqzLvP0M6hjgw_QYJM8j1RCmr1cRLpCztpR_L2_ECqib56eKQm16DCNYBhDWA',
  ZHANG_AVATAR: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyQu_CmPkB3dukqvdSGCrY1PPMRXEaEj3nCTK_UlxdQ8ppTcg9zdqwQ3G49kppqMXya3IO3Kxrrf8iYpxUeIym_RZnJ5sDXxklQw1PkAaTTxCwIVVVRXY9xERu4xuJ91vwtQ34FVBIdIxkD2nK41NwQcmByNXsQuYolSJGqZ1eCYSaTci0eIGJHEk0QEmXfcsk6lYZ9HBkbvxYOAF0K2cxjKl3Ht-UhQPPs16idxiSxcu8UyOaQJIHLLizcfbHiBLMoFdS_Jzd4ac',
  ZHANG_PROXY_AVATAR: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdwwd-xcNiEeAx1bmWl2uKvvtT8CWmlTvsxPZJtd1PlZClQ9rpq3SixyCh6LKnqGkkhqXKF4gvcJgUl-cu3Qc3ehiUmV-rqOHu_fNczKgLAUOeR2W6rybuJpjcRqhCSRQWV8mZB1_Rqs6O_Hrpe1KF5RxAqI8FFUfTGXrQsj913T33wA4flAl8v654P67eUJFjv1cM-9ixZ0ab0dtNtIssLTwy_kJDZhFx9RHn4p801epMW5sEeZRtya2q64QjeSMt_qbxvpAPpEU'
};
