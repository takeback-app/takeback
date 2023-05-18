declare module '*.ttf'
declare module '*.png'

declare module '@env' {
  export const API_URL: string
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}
