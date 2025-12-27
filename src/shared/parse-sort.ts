import { boolean } from "joi";

type Dir = 'asc' | 'desc';
type OrderEntry = { column: string; dir: Dir };

export function parseSort<ConfigType extends Object>(
    SORT_CONFIG: ConfigType,
    raw: string | undefined,
    fallback: OrderEntry[] = [{ column: "id", dir: 'asc' }],
): OrderEntry[] {

  if (!raw) return fallback;

  const out: OrderEntry[] = []

  for(const token of raw.split(',').map((s) => s.trim()).filter(Boolean)){
    let key: string
    let dir: Dir = 'asc'
    
    if(raw.startsWith('-')){
      key = token.slice(1)
      dir = 'desc'
    }
    else if(raw.includes(':')){
      const [k,d] = raw.split(':')
      key = k.trim()
      dir = (d?.toLowerCase() === 'desc' ? 'desc' : 'asc');
    } else{
      key = token; 
    }

    if(key in SORT_CONFIG){
      const column = SORT_CONFIG[key as keyof ConfigType] as string
      out.push({column, dir})
    }

  }

  return out ? out : fallback

  

}