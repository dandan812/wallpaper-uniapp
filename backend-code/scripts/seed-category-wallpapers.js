require('dotenv').config();

const mysql = require('mysql2/promise');
const redis = require('../src/config/redis');

// 每个分类最终保留的目标壁纸数量。
const TARGET_COUNT_PER_CATEGORY = 30;

// 为不同分类准备一组稳定的标题前缀和标签，避免生成的数据太机械。
const CATEGORY_META = {
  '可爱萌宠': {
    titlePrefix: '萌宠治愈',
    tags: ['萌宠', '治愈', '可爱']
  },
  '风景名胜': {
    titlePrefix: '名胜风景',
    tags: ['风景', '自然', '旅行']
  },
  '动漫二次元': {
    titlePrefix: '二次元幻想',
    tags: ['动漫', '幻想', '人物']
  },
  '创意色彩': {
    titlePrefix: '创意色彩',
    tags: ['创意', '色彩', '设计']
  },
  '游戏电竞': {
    titlePrefix: '电竞氛围',
    tags: ['电竞', '游戏', '科技']
  },
  '风景': {
    titlePrefix: '自然风景',
    tags: ['风景', '山水', '户外']
  },
  '动物': {
    titlePrefix: '动物瞬间',
    tags: ['动物', '野生', '自然']
  },
  '城市建筑': {
    titlePrefix: '城市建筑',
    tags: ['城市', '建筑', '现代']
  },
  '极简插画': {
    titlePrefix: '极简插画',
    tags: ['插画', '简约', '线条']
  },
  '汽车机车': {
    titlePrefix: '汽车机车',
    tags: ['汽车', '机车', '速度']
  },
  '宇宙星空': {
    titlePrefix: '宇宙星空',
    tags: ['星空', '宇宙', '梦幻']
  },
  '美食静物': {
    titlePrefix: '美食静物',
    tags: ['美食', '生活', '静物']
  }
};

function getCategoryMeta(categoryName) {
  return CATEGORY_META[categoryName] || {
    titlePrefix: categoryName,
    tags: [categoryName, '高清', '壁纸']
  };
}

function createWallpaperPayload(category, sequence) {
  const meta = getCategoryMeta(category.name);
  const seed = `wallpaper-${category.id}-${sequence}`;
  const score = Number((4 + ((sequence % 10) * 0.1)).toFixed(1));
  const scoreCount = 10 + sequence;
  const downloadCount = 80 + (sequence * 7);
  const viewCount = 260 + (sequence * 19);

  return {
    classid: category.id,
    title: `${meta.titlePrefix}${String(sequence).padStart(2, '0')}`,
    description: `${category.name} 分类扩展示例壁纸 ${sequence}，用于本地开发和小程序页面展示。`,
    picurl: `https://picsum.photos/seed/${seed}/1440/2560`,
    smallPicurl: `https://picsum.photos/seed/${seed}/480/854`,
    tabs: JSON.stringify(meta.tags),
    score,
    scoreCount,
    downloadCount,
    viewCount,
    nickname: '咸虾米',
    status: 1
  };
}

async function clearCategoryRelatedCache() {
  const patterns = [
    'classify:*',
    'wallpapers:*',
    'random_wallpapers:*'
  ];

  for (const pattern of patterns) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
  });

  try {
    const [categories] = await connection.execute(
      'SELECT id, name FROM categories ORDER BY id ASC'
    );

    for (const category of categories) {
      const [rows] = await connection.execute(
        'SELECT COUNT(*) AS total FROM wallpapers WHERE classid = ?',
        [category.id]
      );
      const currentCount = rows[0].total;

      if (currentCount >= TARGET_COUNT_PER_CATEGORY) {
        continue;
      }

      const missingCount = TARGET_COUNT_PER_CATEGORY - currentCount;

      for (let index = 1; index <= missingCount; index += 1) {
        const sequence = currentCount + index;
        const wallpaper = createWallpaperPayload(category, sequence);

        await connection.execute(
          `INSERT INTO wallpapers
          (classid, title, description, picurl, small_picurl, tabs, score, score_count, download_count, view_count, nickname, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            wallpaper.classid,
            wallpaper.title,
            wallpaper.description,
            wallpaper.picurl,
            wallpaper.smallPicurl,
            wallpaper.tabs,
            wallpaper.score,
            wallpaper.scoreCount,
            wallpaper.downloadCount,
            wallpaper.viewCount,
            wallpaper.nickname,
            wallpaper.status
          ]
        );
      }

      await connection.execute(
        'UPDATE categories SET wallpaper_count = ? WHERE id = ?',
        [TARGET_COUNT_PER_CATEGORY, category.id]
      );
    }

    await clearCategoryRelatedCache();

    const [summary] = await connection.execute(
      'SELECT c.id, c.name, COUNT(w.id) AS total FROM categories c LEFT JOIN wallpapers w ON w.classid = c.id GROUP BY c.id, c.name ORDER BY c.id ASC'
    );

    console.table(summary);
  } finally {
    await connection.end();
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('补充分类壁纸失败:', err);
  process.exit(1);
});
