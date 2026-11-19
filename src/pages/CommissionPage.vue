<script setup>
import { ref } from 'vue'

const walkthroughImages = Object.entries(
  import.meta.glob('../../commission_img/*.{png,jpg,jpeg,webp,avif}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)
  .filter(([path]) => path.includes('走带视频'))
  .sort(([left], [right]) => left.localeCompare(right, 'zh-CN'))
  .map(([, url]) => url)

const coverExamples = Object.entries(
  import.meta.glob('../../commission_img/*.{png,jpg,jpeg,webp,avif}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)
  .filter(([path]) => path.includes('专辑&视频封面'))
  .sort(([left], [right]) => left.localeCompare(right, 'zh-CN'))
  .map(([, url]) => url)

const mmdCovers = Object.entries(
  import.meta.glob('../../commission_img/MMD视频*.{png,jpg,jpeg,webp,avif}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)
  .sort(([left], [right]) => left.localeCompare(right, 'zh-CN'))
  .map(([, url]) => url)

const auditionQr = Object.entries(
  import.meta.glob('../../commission_img/试听二维码.{png,jpg,jpeg,webp,avif}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)[0]?.[1]

const auditionBilibiliCover = Object.entries(
  import.meta.glob('../../commission_img/B站试听封面.{png,jpg,jpeg,webp,avif}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)[0]?.[1]

const activeSection = ref('notes')

const commissionSections = [
  { id: 'notes', label: '注意事项' },
  { id: 'prices', label: '价目表' },
  { id: 'free', label: '无偿服务' },
  { id: 'faq', label: 'QA 问答' },
  { id: 'audition', label: '试听' },
]

const importantNotes = [
  '擅长风格：舒缓情歌、情绪朋克、古风抒情与燃曲、电子舞曲。',
  '婉拒类型：BPM 过快的高速神言（普通快歌可以接受）、饶舌 Rap、复杂和声。',
  '标价均为非商业用途；商用价格为标价 ×3。原创曲歌手为星尘时，价格按七折计算。',
  '不接加急、加塞；高价委托随缘接单，报价过高时也会拒绝，以避免过大的工作压力。',
  '可免费协助寻找 UST、伴奏等；如需额外扒谱，费用 +20R。本人保留该工程的分发（配布）权和使用权。',
  '约稿前请先试听，确认风格合适后再下单。',
  '默认后付，支持平台交易、定金与尾款；一口价，中途不浮价、不加价。',
  '干声交付前可全额退款；干声交付后不支持任何形式的退款。',
  '翻唱曲工期 8 天，原创曲工期 16 天；部分时段以实际排单日期为准。',
  '主用调校引擎：UTAU（OpenUTAU）、DiffSinger、Synthesizer V Studio、ACE Studio 等。额外引擎：VOCALOID、DeepVocal、VocalSharp、X Studio、VoiSona、CeVIO AI（额外引擎调校经验较少，因此不优先推荐）。',
  '有疑问请及时沟通，正常需求都会尽量满足。',
  '婉拒一切违法违纪、扰乱社会秩序或违背人伦的词曲等内容。',
]

const packages = [
  {
    code: 'A',
    title: '全曲',
    subtitle: '调声套餐 A',
    price: '120R / 1首',
    items: [
      '协助寻找 UST，包含和声、免费贴唱，提供音频标签（Tag）服务，可在支持标签的播放器中读取。',
      '全曲时长不得超过 5 分 30 秒，超时婉拒。',
      '拼接型引擎支持中文、日语、英语；AI 引擎支持软件自带的跨语种范围（以 Synthesizer V Studio 为准）。',
    ],
  },
  {
    code: 'B',
    title: '片段',
    subtitle: '调声套餐 B',
    price: '9.9R / 片段',
    items: [
      '协助寻找 UST，不含和声、免费贴唱，提供伪清唱混响（偏 Live 风格的无伴奏 Mix）。',
      '片段时长不得超过 30 秒，超时婉拒。',
      '拼接型引擎支持中文、日语、英语；AI 引擎支持软件自带的跨语种范围（以 Synthesizer V Studio 为准）。',
    ],
  },
  {
    code: 'C',
    title: '盲盒',
    subtitle: '调声套餐 C',
    price: '80R / 1首',
    items: [
      '根据个人对声库的第一印象选曲，可以指定 P 主和曲风，也可以指定不使用的曲目。',
      '默认选曲时长不超过 5 分 30 秒。',
      '以声库支持的语种为准。',
    ],
  },
  {
    code: 'A',
    title: '语调校',
    subtitle: '其他套餐 A',
    price: '9.9R / 10字',
    items: [
      '支持中文普通话、吴语（以上海话为主）和日语；日语需要提供准确标音。',
      '支持诗朗诵、念白与语气词，例如“啊！”“诶～”等。',
    ],
  },
  {
    code: 'B',
    title: '跨语种 / 戏曲相关',
    subtitle: '其他套餐 B',
    price: '300R / 1首',
    items: [
      '包含调声套餐 A 的全部内容，并附带免费扒谱；若自带已完成跨语种的工程文件，按调声套餐 A 的价格结算。',
      '支持跨语种：中文普通话、日语、英语、韩语、德语、法语、俄语、西班牙语。跨语种无法保证口音准确，部分语种的大舌音与小舌音也无法完美还原，请考虑清楚后再下单。',
      '戏曲支持越剧、黄梅戏、京剧、评弹，均需提供准确参考片段，例如《梁祝·十八相送》。',
      '段落时长不得超过 6 分钟，超时婉拒。',
      '拼接型引擎仅支持中文声库；AI 引擎仅支持 DiffSinger、Synthesizer V Studio、ACE Studio。因戏曲咬字与唱法差异较大，可能无法完美还原，请确认后再下单。',
    ],
  },
  {
    code: 'D',
    title: '灌词',
    subtitle: '其他套餐 C',
    price: '10R / 1首',
    items: [
      '支持中文普通话、日语、英语、韩语、德语、法语、俄语、西班牙语，使用 Synthesizer V Studio 制作。',
      '完成后提供 SVP、MIDI 和 USTX 格式文件。',
    ],
  },
  {
    code: 'E',
    title: '扒谱',
    subtitle: '其他套餐 D',
    price: '25R / 1首',
    items: [
      '默认扒主轨与和声，包含灌词。',
      '交付内容：Synthesizer V 1/2 的 SVP、UST 与 USTX、已完成灌词的 MIDI、伴奏及试听。',
    ],
  },
]

const freeServices = [
  {
    code: 'A',
    title: '走带视频 / 一图流 PV / 排版展示',
    meta: '支持竖屏',
    description: '图片仅供参考，风格不同时最终效果也会有所差异。',
    images: walkthroughImages,
  },
  {
    code: 'B',
    title: 'MMD 视频',
    meta: '默认竖屏 · 可横屏',
    description:
      '图片仅供参考，风格不同时最终效果也会有所差异。MMD 视频时长不超过 30 秒（不含舞台）；可协助 K 帧和制作表情参数，一般为手势舞级别。',
    videos: [
      {
        bvid: '1B7Jc6EEVY',
        title: '天空和地球转啊转',
        url: 'https://www.bilibili.com/video/BV1B7Jc6EEVY/',
        cover: mmdCovers[0],
      },
      {
        bvid: '1V6Vm6tEdr',
        title: 'Miku：得劲魔法！！！',
        url: 'https://www.bilibili.com/video/BV1V6Vm6tEdr/',
        cover: mmdCovers[1],
      },
      {
        bvid: '149jR6kEwG',
        title: '！？人是猫！？',
        url: 'https://www.bilibili.com/video/BV149jR6kEwG/',
        cover: mmdCovers[2],
      },
    ],
  },
  {
    code: 'C',
    title: '专辑封面 / 视频封面',
    meta: '封面设计',
    description: '包含封面、标题和简介设计；原创曲可协助制作歌词轴。',
    images: coverExamples,
  },
]

const faqs = [
  {
    question: '约稿的作品会被展示出来吗？',
    answer: '默认不展示。',
  },
  {
    question: '稿件交付是什么格式？其中包含哪些内容？',
    answer:
      '.zip 格式压缩包，内含：MP3 音频（附带 LRC 歌词文件）、干声与伴奏、WAV 音频、工程文件，以及 readme.txt（有时会附带，用于说明如何复现该工程）。',
  },
  {
    question: '可以把音频封面换成我的 OC 或其他图片吗？这样收费吗？',
    answer: '可以，可免费协助制作专辑封面。',
  },
  {
    question: '可以把音频上传到网络平台吗？',
    answer:
      '在不违反法律法规和平台规则的情况下，可以将音频上传至任意平台。如需上传 B 站、小红书、抖音或快手，请先与我联系，并在简介中注明 UST 作者、调声参与者等信息。',
  },
  {
    question: '能拿去当手书、配乐、混剪配乐或声库展示使用吗？',
    answer:
      '可以，但需要在简介中注明 UST 作者、调声参与者等信息。其余用途可自由支配。',
  },
  {
    question: '混音是免费的吗？',
    answer: '是免费的，但效果较为基础；如需更复杂的混音效果，建议另找专门的混音老师。',
  },
  {
    question: '二次填词的作品可以接吗？',
    answer:
      '可以。请提前告知原曲名、填词歌曲，以及背景故事或它所对应的游戏、影视作品等信息。',
  },
  {
    question: '多人合唱会额外浮动收费吗？',
    answer:
      '不会浮动已经约定好的费用。但若合唱人数超过 6 人，或轨道数超过 10 轨，我会婉拒。',
  },
  {
    question: '没找到相关工程文件时怎么收费？',
    answer:
      '如需我扒谱，额外收取 +20R，本人保留该工程的分发（配布）权。曲目过于复杂或听不清楚时可能会拒绝。',
  },
  {
    question: '调好的工程文件可以额外分发吗？',
    answer:
      '如果工程文件由您提供，或由我扒谱并单独制作，可以额外分发，但请在调声署名或作品简介中注明我的信息。',
  },
]
</script>

<template>
  <div class="page-container commission-page container">
    <div class="commission-tabs" role="tablist" aria-label="委托业务栏目">
      <button
        v-for="section in commissionSections"
        :key="section.id"
        type="button"
        role="tab"
        :id="`commission-tab-${section.id}`"
        :aria-controls="`commission-panel-${section.id}`"
        :aria-selected="activeSection === section.id"
        :tabindex="activeSection === section.id ? 0 : -1"
        :class="{ active: activeSection === section.id }"
        @click="activeSection = section.id"
      >
        <strong>{{ section.label }}</strong>
      </button>
    </div>

    <div class="commission-panels">
      <Transition name="commission-switch" mode="out-in">
        <section
          v-if="activeSection === 'notes'"
          id="commission-panel-notes"
          key="notes"
          class="commission-section"
          role="tabpanel"
          aria-labelledby="commission-tab-notes"
        >
          <h2 class="commission-notes-title">注意事项</h2>
          <ol class="commission-notes">
            <li v-for="note in importantNotes" :key="note">{{ note }}</li>
          </ol>
        </section>

        <section
          v-else-if="activeSection === 'prices'"
          id="commission-panel-prices"
          key="prices"
          class="commission-section"
          role="tabpanel"
          aria-labelledby="commission-tab-prices"
        >
          <div class="commission-price-grid">
            <article
              v-for="item in packages"
              :key="`${item.title}-${item.subtitle}`"
              class="commission-package"
            >
              <div class="commission-package-head">
                <div>
                  <h3>{{ item.title }}</h3>
                  <small>{{ item.subtitle }}</small>
                </div>
                <strong>{{ item.price }}</strong>
              </div>
              <ul>
                <li v-for="point in item.items" :key="point">{{ point }}</li>
              </ul>
            </article>
          </div>
        </section>

        <section
          v-else-if="activeSection === 'free'"
          id="commission-panel-free"
          key="free"
          class="commission-section"
          role="tabpanel"
          aria-labelledby="commission-tab-free"
        >
          <p class="commission-section-note">
            素材和模板来自剪映、Canva 可画等软件；MMD
            素材来自各位老师的配布，均不可商用，请注意使用范围。贴唱混音为无偿服务，不支持添加延迟、回声等特殊效果。
          </p>
          <div class="commission-free-grid">
            <article
              v-for="item in freeServices"
              :key="item.title"
              class="commission-free-card"
            >
              <small>{{ item.meta }}</small>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <div v-if="item.videos?.length" class="commission-video-grid">
                <a
                  v-for="(video, videoIndex) in item.videos"
                  :key="video.bvid"
                  class="commission-video-item"
                  :href="video.url"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div class="commission-video-cover">
                    <img
                      :src="video.cover"
                      :alt="`${video.title}视频封面`"
                      loading="lazy"
                    />
                    <span aria-hidden="true">▶</span>
                  </div>
                  <div class="commission-video-copy">
                    <small>MMD 示例 {{ videoIndex + 1 }}</small>
                    <strong>{{ video.title }}</strong>
                    <span>在 Bilibili 打开 ↗</span>
                  </div>
                </a>
              </div>
              <div
                v-if="item.images?.length"
                class="commission-example-grid"
                :class="{ 'is-cover': item.code === 'C' }"
              >
                <figure
                  v-for="(image, imageIndex) in item.images"
                  :key="image"
                >
                  <img
                    :src="image"
                    :alt="`${item.title}示例 ${imageIndex + 1}`"
                    loading="lazy"
                  />
                </figure>
              </div>
            </article>
          </div>
        </section>

        <section
          v-else-if="activeSection === 'faq'"
          id="commission-panel-faq"
          key="faq"
          class="commission-section commission-faq-section"
          role="tabpanel"
          aria-labelledby="commission-tab-faq"
        >
          <div class="commission-faq-list">
            <details
              v-for="(item, index) in faqs"
              :key="item.question"
              class="commission-faq"
            >
              <summary>
                <span class="commission-faq-index">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <strong>Q：{{ item.question }}</strong>
                <i aria-hidden="true">+</i>
              </summary>
              <p><b>A：</b>{{ item.answer }}</p>
            </details>
          </div>
        </section>

        <section
          v-else
          id="commission-panel-audition"
          key="audition"
          class="commission-section commission-audition-panel"
          role="tabpanel"
          aria-labelledby="commission-tab-audition"
        >
          <header class="commission-audition-heading">
            <h2>试听展示</h2>
            <p>扫码或点击进入百度网盘进行试听</p>
          </header>
          <div class="commission-audition-sources">
            <article class="commission-audition-card">
              <header>
                <small>百度网盘</small>
                <h3>网盘试听</h3>
              </header>
              <figure class="commission-audition-qr">
                <img :src="auditionQr" alt="百度网盘试听二维码" />
                <figcaption>扫码试听</figcaption>
              </figure>
              <a
                href="https://pan.baidu.com/s/5uFQXZDcEsfEg5_IbIoa-Cg"
                target="_blank"
                rel="noreferrer"
              >
                打开百度网盘试听
              </a>
            </article>
            <article class="commission-audition-card is-bilibili">
              <header>
                <small>B 站</small>
                <h3>多引擎 · 歌声合成『摸鱼合集』Season 1</h3>
              </header>
              <a
                class="commission-audition-cover"
                href="https://www.bilibili.com/video/BV1Sygi6LEuu/"
                target="_blank"
                rel="noreferrer"
              >
                <img :src="auditionBilibiliCover" alt="B 站试听视频封面" />
                <span aria-hidden="true">▶</span>
              </a>
              <a
                href="https://www.bilibili.com/video/BV1Sygi6LEuu/"
                target="_blank"
                rel="noreferrer"
              >
                打开 B 站视频
              </a>
            </article>
          </div>
        </section>
      </Transition>
    </div>
  </div>
</template>
