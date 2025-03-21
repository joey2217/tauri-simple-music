import type {
  AlbumInfo,
  ArtistInfo,
  ArtistPageData,
  ArtistRes,
  BannerItem,
  LyricData,
  MiguResponse,
  PageData,
  PlayListItem,
  PlayListTag,
  PlaylistInfo,
  RankingListData,
  SearchData,
  SearchHorWord,
  SearchSuggest,
  SongDetail,
  SongInfo,
  SongItem,
} from '../types/migu'
import { parseLyric } from '../lib'
import { request } from './request'

const cache = new Map<string, unknown>()

function miguRequest<T>(
  input: string | URL | Request,
  cacheKey?: string,
  init?: RequestInit | undefined
) {
  if (cacheKey && cache.has(cacheKey) && import.meta.env.PROD) {
    return Promise.resolve(cache.get(cacheKey) as T)
  }
  return request<MiguResponse<T>>(input, init)
    .then((data) => {
      if (data.code === '200') {
        if (cacheKey) {
          cache.set(cacheKey, data.data)
        }
        return data.data
      }
      throw new Error(data.msg)
    })
    .catch((error) => {
      console.error(error, init, cacheKey)
      throw error
    })
}

//搜索
export function fetchSearchData(
  keyword: string,
  page: number = 1,
  pageSize = 30
) {
  if (keyword === '') {
    throw new Error('搜索关键字不能为空')
  }
  return request<MiguResponse<SearchData>>(
    `https://m.music.migu.cn/migumusic/h5/search/all?text=${keyword}&pageNo=${page}&pageSize=${pageSize}`
  )
    .then((data) => {
      if (data.code === '200') {
        return data.data
      }
      throw new Error(data.msg)
    })
}

// const songInfoCache = new Map<string, SongInfo>()

// 歌曲详情
export function fetchSongInfo(copyrightId: string) {
  // if (songInfoCache.has(copyrightId)) {
  //   return Promise.resolve(songInfoCache.get(copyrightId)!)
  // }
  const cacheKey = `SongInfo_${copyrightId}`
  if (cache.has(cacheKey)) {
    return Promise.resolve(cache.get(cacheKey) as SongInfo)
  }
  return request<MiguResponse<SongInfo>>(
    `https://m.music.migu.cn/migumusic/h5/play/auth/getSongPlayInfo?copyrightId=${copyrightId}&type=2`
  )
    .then((data) => {
      if (data.code === '200') {
        // songInfoCache.set(copyrightId, data.data)
        const songInfo = data.data
        if (songInfo.playUrl) {
          if (songInfo.playUrl.startsWith('//')) {
            songInfo.playUrl = 'http:' + songInfo.playUrl
          }
          cache.set(cacheKey, songInfo)
          return songInfo
        }
      }
      throw new Error(data.msg)
    })
}

// 排行榜 "https://app.c.nf.migu.cn/MIGUM3.0/v1.0/content/querycontentbyId.do?needAll=0&columnId=27553319"
export function fetchRankingList(columnId: string) {
  return fetch(
    `https://app.c.nf.migu.cn/MIGUM3.0/v1.0/content/querycontentbyId.do?needAll=0&columnId=${columnId}`
  )
    .then((res) => res.json())
    .then((data: RankingListData) => {
      if (data.code === '000000') {
        return data.columnInfo
      }
      throw new Error(data.info)
    })
}

//  `https://app.c.nf.migu.cn/MIGUM3.0/bmw/singer-index/list/v1.0?templateVersion=3&tab=${e}-${t}`,
export function fetchArtistList(type: string, area: string) {
  return fetch(
    `https://app.c.nf.migu.cn/MIGUM3.0/bmw/singer-index/list/v1.0?templateVersion=3&tab=${area}-${type}`
  )
    .then((res) => res.json())
    .then((data: ArtistRes) => {
      if (data.code === '000000') {
        return data.data.contents
      }
      throw new Error(data.info)
    })
}

// `https://m.music.migu.cn/migumusic/h5/singer/getSingerDetail?singerId=${e}`
export function fetchArtistDetail(singerId: string) {
  return fetch(
    `https://m.music.migu.cn/migumusic/h5/singer/getSingerDetail?singerId=${singerId}`
  )
    .then((res) => res.json())
    .then((data: MiguResponse<ArtistInfo>) => {
      if (data.code === '200') {
        return data.data
      }
      throw new Error(data.msg)
    })
}

//`https://m.music.migu.cn/migumusic/h5/singer/getSingerSAM?singerId=${e}&pageNo=${t}&pageSize=${n}&sam=${o}`,
export function fetchArtistSong(
  singerId: string,
  pageNo = 1,
  sam = '100', // 歌曲/专辑/MV
  pageSize = 30
) {
  return fetch(
    `https://m.music.migu.cn/migumusic/h5/singer/getSingerSAM?singerId=${singerId}&pageNo=${pageNo}&pageSize=${pageSize}&sam=${sam}`
  )
    .then((res) => res.json())
    .then((data: MiguResponse<ArtistPageData>) => {
      if (data.code === '200') {
        return data.data
      }
      throw new Error(data.msg)
    })
}

export function fetchBanner() {
  return fetch('https://m.music.migu.cn/migumusic/h5/home/banner')
    .then((res) => res.json())
    .then((data: MiguResponse<BannerItem[]>) => {
      if (data.code === '200') {
        return data.data.map((d) => ({
          ...d,
          url: d.url.replace('/v4/music', ''),
          image: 'https:' + d.image,
        }))
      }
      throw new Error(data.msg)
    })
}

// 歌单
//  (e, t, n) => `https://m.music.migu.cn/migumusic/h5/playlist/list?columnId=15127272&tagId=${e}&pageNum=${t}&pageSize=${n}
// https://m.music.migu.cn/migumusic/h5/playlist/list?columnId=15127272&tagId=1000001683&pageNum=1&pageSize=30
export function fetchPlaylist(tagId: string = '', page = 1, size = 30) {
  return miguRequest<PageData<PlayListItem>>(
    `https://m.music.migu.cn/migumusic/h5/playlist/list?columnId=15127272&tagId=${tagId}&pageNum=${page}&pageSize=${size}`,
    `fetchPlaylist_${tagId}_${page}_${size}`
  )
}

// https://m.music.migu.cn/migumusic/h5/playlist/info?songListId=215243155
export function fetchPlaylistInfo(playlistId: string) {
  return miguRequest<PlaylistInfo>(
    `https://m.music.migu.cn/migumusic/h5/playlist/info?songListId=${playlistId}`,
    `fetchPlaylistInfo_${playlistId}`
  )
}
// https://m.music.migu.cn/migumusic/h5/playlist/songsInfo?palylistId=215243155&pageNo=1&pageSize=18
export function fetchPlaylistSongs(playlistId: string, page = 1, size = 20) {
  return miguRequest<PageData<SongItem>>(
    `https://m.music.migu.cn/migumusic/h5/playlist/songsInfo?palylistId=${playlistId}&pageNo=${page}&pageSize=${size}`,
    `playlist_${playlistId}_${page}_${size}`
  )
}

// 专辑 `https://m.music.migu.cn/migumusic/h5/album/info?albumId=${e}`
export function fetchAlbum(albumId: string) {
  return miguRequest<AlbumInfo>(
    `https://m.music.migu.cn/migumusic/h5/album/info?albumId=${albumId}`,
    `fetchAlbum_${albumId}`
  )
  // .then((res) => res.json())
  // .then((data: MiguResponse<AlbumInfo>) => {
  //   if (data.code === '200') {
  //     return data.data
  //   }
  //   throw new Error(data.msg)
  // })
}

// 歌单tag
export function fetchPlaylistTags() {
  return miguRequest<PlayListTag[]>(
    'https://m.music.migu.cn/migumusic/h5/playlist/hotTag',
    'fetchPlaylistTags'
  )
}

// 歌曲详情
// https://m.music.migu.cn/migumusic/h5/song/info?copyrightId=69918307280
export function fetchSongDetail(copyrightId: string) {
  return miguRequest<SongDetail>(
    `https://m.music.migu.cn/migumusic/h5/song/info?copyrightId=${copyrightId}`,
    'fetchSongDetail' + copyrightId
  )
}

// 搜索热词
// https://m.music.migu.cn/migumusic/h5/search/platform/hotWord
export function fetchSearchHotWord() {
  return miguRequest<SearchHorWord>(
    'https://m.music.migu.cn/migumusic/h5/search/platform/hotWord',
    'hotWords'
  ).then((data) => {
    if (data && data.hotwords.length > 0) {
      return data.hotwords[0].hotwordList
    }
    throw new Error('获取搜索热词失败')
  })
}
// https://m.music.migu.cn/migumusic/h5/search/suggest?text=%E5%91%A8
// 搜索建议
export function fetchSearchSuggest(keyword: string) {
  return miguRequest<SearchSuggest>(
    `https://m.music.migu.cn/migumusic/h5/search/suggest?text=${keyword}`
  )
}

// 歌词 `https://m.music.migu.cn/migumusic/h5/song/lyric?copyrightId=${e}`
export function fetchSongLyric(copyrightId: string) {
  return miguRequest<LyricData>(
    `https://m.music.migu.cn/migumusic/h5/song/lyric?copyrightId=${copyrightId}`,
    'fetchSongLyric' + copyrightId
  ).then((data) => {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        return [key, parseLyric(value)]
      })
    )
  })
}
