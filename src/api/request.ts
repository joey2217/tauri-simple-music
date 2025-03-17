import { fetch } from '@tauri-apps/plugin-http';

interface HeaderRes {
    status: number;
    message: string;
    data: HeaderData[];
}

interface HeaderData {
    id: number;
    from: string;
    cookie: string;
    channel: string;
    referer: string;
    user_agent: string;
    by: string;
    secret: string;
}

let headers = {
    Referer: 'https://m.music.migu.cn/v4/',
    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    By: '4f09e01c83d69100c363c33aecfef9f8',
    channel: '014000D',
    Cookie: 'SESSION=MmU0ZDNlZWMtMjgwNS00ODcwLTk0MTMtZmU5YjVmY2UzNmM5',
}



const LOCAL_HEDAR_KEY = 'header'

function getLocalHeader() {
    try {
        const localHeader = localStorage.getItem(LOCAL_HEDAR_KEY)
        if (localHeader) {
            headers = JSON.parse(localHeader)
        }
    } catch (error) {

    }
}

async function fetchHeader() {
    getLocalHeader()
    const res = await fetch('http://fonger.feiyux.top/api/fonger//headers', {
        headers: {
            "secret": "5pa55qC86Z+z5LmQ54mb6YC8"
        }
    })
    if (res.ok) {
        const data: HeaderRes = await res.json();
        if (data.status === 200) {
            let mg = data.data.find(item => item.from === 'MG')
            if (mg === undefined) {
                mg = data.data[0]
            }
            if (mg) {
                headers.By = mg.by
                headers.Referer = mg.referer
                headers.channel = mg.channel
                headers.Cookie = mg.cookie
                headers['User-Agent'] = mg.user_agent
                localStorage.setItem('headers', JSON.stringify(headers))
                if (import.meta.env.DEV) {
                    console.log(headers)
                }
            }
        }
    }
}

fetchHeader()

export async function request<T = unknown>(input: URL | Request | string, init?: RequestInit) {
    const res = await fetch(input, init)
    if (res.ok) {
        const data = await res.json()
        return data as T
    }
    throw new Error('Request failed')
}