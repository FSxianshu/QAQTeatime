const coverImages = import.meta.glob(
  '../../img/*.{png,jpg,jpeg,webp,avif,gif}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
)

function resolveAsset(assets, filename) {
  const entry = Object.entries(assets).find(([path]) =>
    path.endsWith(`/${filename}`),
  )

  return entry?.[1] ?? ''
}

const releaseDownloadBase =
  'https://github.com/FSxianshu/QAQTeatime/releases/download/downloads-v1'

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'guidelines', label: 'Guidelines' },
  { id: 'contact', label: 'Connect' },
]

export const profile = {
  name: '赋水的水果茶铺',
  role: '歌声合成相关个人站点',
  intro: '',
  email: 'FSxianshu@163.com',
  updatedAt: '2026.11.14',
  bannerCredit: '背景画师 · 武内崇',
  focusAreas: [
    {
      title: 'SVP 工程',
      description: '整理可供查看、转换格式和用于创作的 SVP 工程文件。',
      tags: ['SVP', '工程', '音乐'],
    },
    {
      title: 'USTX 与 MIDI',
      description: '附带对应的 USTX、UST 和 MIDI 文件，便于继续编辑。',
      tags: ['USTX', 'UST', 'MIDI'],
    },
    {
      title: '伴奏与示例',
      description: '部分压缩包内含伴奏或示例音频，使用前请确认原曲作者的要求。',
      tags: ['Instrumental', 'Sample'],
    },
  ],
}

const projectRecords = [
  {
    id: 'close-to-me',
    title: 'close to me',
    coverFile: 'close to me.jpg',
    description: '工程内含 SVP、USTX、UST、MIDI 与随附音频。',
    formats: ['SVP', 'USTX', 'MIDI'],
    size: '10.9 MB',
  },
  {
    id: 'minazuki-no-tooriame',
    title: '水無月の通り雨',
    coverFile: '水無月の通り雨.jpg',
    description: '工程内含 SVP、USTX、UST、MIDI 与随附音频。',
    formats: ['SVP', 'USTX', 'MIDI'],
    size: '8.0 MB',
  },
  {
    id: 'suisei-to-machi',
    title: '彗星と街',
    coverFile: '彗星と街.jpg',
    description: '工程内含 SVP、USTX、MIDI、伴奏及相关工程文件。',
    formats: ['SVP', 'USTX', 'MIDI'],
    size: '9.3 MB',
  },
  {
    id: 'sensu-naki-kokoro',
    title: '扇子なき心',
    coverFile: '扇子なき心.jpg',
    description: '工程内含 SVP、USTX、UST、MIDI 与随附音频。',
    formats: ['SVP', 'USTX', 'MIDI'],
    size: '11.2 MB',
  },
  {
    id: 'kafuka',
    title: '化孵化（kafuka）',
    coverFile: 'kafuka.jpg',
    description: '工程内含 SVP、USTX、UST、MIDI 与伴奏。',
    formats: ['SVP', 'USTX', 'MIDI'],
    size: '4.8 MB',
  },
  {
    id: 'beadama',
    title: 'ビー玉',
    coverFile: 'ビー玉.jpg',
    description: '工程内含 SVP、USTX、UST、MIDI 与伴奏。',
    formats: ['SVP', 'USTX', 'MIDI'],
    size: '5.0 MB',
  },
  {
    id: 'tell-me-why-you-sing',
    title: '告诉我你歌唱的理由吧',
    coverFile: '告诉我你歌唱的理由吧.jpg',
    description: '工程内含单人版本、SVP、USTX、UST、MIDI 与伴奏。',
    formats: ['SVP', 'USTX', 'MIDI'],
    size: '5.1 MB',
  },
  {
    id: 'summer-s-end',
    title: '夏日尽头的我们',
    coverFile: '夏日尽头的我们.jpg',
    description: '工程内含 SVP、USTX、UST、MIDI 与伴奏。',
    formats: ['SVP', 'USTX', 'MIDI'],
    size: '2.9 MB',
  },
  {
    id: 'regretful-patchwork',
    title: '拼接遗憾',
    coverFile: '拼接遗憾.jpg',
    description: '工程内含 SVP、USTX、UST、MIDI 与伴奏。',
    formats: ['SVP', 'USTX', 'MIDI'],
    size: '2.5 MB',
  },
]

export const engineeringFiles = projectRecords.map((project, index) => {
  const href = `${releaseDownloadBase}/${project.id}.zip`

  return {
    ...project,
    category: '工程',
    format: 'ZIP',
    updated: '2026.11.14',
    href,
    cover: resolveAsset(coverImages, project.coverFile),
    available: true,
    featured: index === 0,
  }
})

export const guidelines = [
  {
    id: 'allowed',
    title: '许可的范围',
    points: [
      '随压缩包附带的伴奏仅供参考, 如有需求, 请从官方频道下载.',
      '使用本工程无需授权, 注明作者 (例: SVP 赋水仙术) 即可; 此外, 您可以随意转换工程格式.',
      '有参工程均可用于套参并发布视频, 音频等, 但请勿二次配布.',
      '可以使用该工程进行约稿.',
      '允许将该工程用于 AI 换声模型项目 (如 RVC 类), 有授权的 AI 换声软件 (如 Vocoflex 类), 人力 Vocaloid 以及鬼畜视频制作, 但本人不对由此产生的任何问题负责.',
    ],
  },
  {
    id: 'forbidden',
    title: '禁止的范围',
    points: [
      '禁止倒卖, 二次配布该工程, 或发表自作发言.',
      '禁止在使用该工程时超出原曲作者规定的使用范围.',
      '禁止使用该工程文件进行非法的二次创作.',
    ],
  },
]

export const contactLinks = [
  {
    label: 'GitHub',
    handle: 'FSxianshu',
    description: 'Github主页',
    href: 'https://github.com/FSxianshu',
  },
  {
    label: '哔哩哔哩',
    handle: '赋水仙术',
    description: '哔哩哔哩主页',
    href: 'https://space.bilibili.com/31861557',
  },
  {
    label: '电子邮箱',
    handle: 'FSxianshu@163.com',
    description: '目前正在使用的Email',
    href: '',
  },
  {
    label: 'USTX站',
    handle: '赋水仙术',
    description: 'USTX站的发布点',
    href: 'https://ustx.top/profile.html?id=5a1e404e-44ee-4921-8db8-3495a56a0bc9',
  },
]
