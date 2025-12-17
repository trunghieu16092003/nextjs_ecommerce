import envConfig from "@/config"

type CustomOptions = RequestInit & { baseUrl?: string | undefined }

class HttpError extends Error {
  status: number
  payload: any
  constructor({status, payload}: {status: number, payload: any}) {
    super(payload.message)
    this.status = status
    this.payload = payload
  }
}

class SessionToken {
  private token = '';
  get value() {
    return this.token;
  }
  set value(token: string) {
    //Nếu gọi method này ở server thì sẽ bị lỗi
    if(typeof window === 'undefined') {
      throw new Error('SessionToken can only be set in a browser environment');
    }
    this.token = token;
  }
}

export const sessionToken = new SessionToken();

const request = async <Response> (method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, options?: CustomOptions | undefined) => {
 
  const body = options?.body ? JSON.stringify(options.body) : undefined
  const baseHeaders = {
    'Content-Type': 'application/json',
  }

  // Nêu không truyên baseURl hoặc baseUrl là undefined thì lấy từ envConfig
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào mà '' thì là gọi api đến next server
  const baseUrl = options?.baseUrl === undefined ? envConfig?.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl

  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
        ...baseHeaders,
        ...options?.headers,
    },
    body,
    method,
  })
  const payload: Response = await res.json()
  const data = { status: res.status, payload }
  if (!res.ok) {
    throw new HttpError(data)
  }
 return data
}

const http = {
    get<Response>(url: string, options?: Omit<CustomOptions, 'body'>) {
        return request<Response>('GET', url, options)
    },
    post<Response>(url: string, body?: any, options?: Omit<CustomOptions, 'body'>) {
        return request<Response>('POST', url, { ...options, body })
    },
    put<Response>(url: string, body?: any, options?: Omit<CustomOptions, 'body'>) {
        return request<Response>('PUT', url, { ...options, body })
    },
    delete<Response>(url: string, body?: any,  options?: Omit<CustomOptions, 'body'>) {
        return request<Response>('DELETE', url, { ...options, body })
    },
}

export default http;