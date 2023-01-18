// Accesses userId from user Cookies

export function useUser() {
  return { id: document?.cookie?.match(/userId=(?<id>[^;]+);?$/)?.groups?.id };
}
