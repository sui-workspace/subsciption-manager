export interface HeaderUrlItem {
  name: string;
  url: string;
  sub: HeaderUrlItem[] | null;
}

export const HeaderUrl: HeaderUrlItem[] = [
  {
    name: 'Swap',
    url: '/swap',
    sub: null,
  },
];
