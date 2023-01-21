// Accesses userId from user Cookies
import { useCookies } from 'react-cookie';

export function useUser() {
  //   return { id: document.cookie.match(/userId=(?<id>[^;]+);?$/)?.groups?.id };
  const [cookies] = useCookies(['userId']);
  return cookies.userId;
}
