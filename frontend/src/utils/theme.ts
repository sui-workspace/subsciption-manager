// theme.ts

interface ThemeColors {
    bg: string;
    black: string;
    white: string;
    pink: string;
    purple: string;
    cream: string;
    grey: string;
    transparentWhite: string;
    accessibleDarkGrey: string;
}

interface ThemeSpacing {
    paddingContainer: string;
    paddingXlarge: string;
    paddingLarge: string;
    paddingMed: string;
    paddingSmall: string;
    paddingMini: string;
    gapSmall: string;
    gapMed: string;
    gapLarge: string;
    gapXlarge: string;
    gapMini: string;
}

interface ThemeBorderRadius {
    small: string;
    medium: string;
    large: string;
}

interface ThemeFontWeight {
    normal: number;
    medium: number;
    bold: number;
}

export interface Theme {
    colors: ThemeColors;
    spacing: ThemeSpacing;
    borderRadius: ThemeBorderRadius;
    fontWeight: ThemeFontWeight;
}

export const theme: Theme = {
    colors: {
        bg: '#181818',
        black: '#0d0d0d',
        white: 'white',
        pink: '#ff97d5',
        purple: '#782cda',
        cream: '#f8b994',
        grey: '#e6e6e6',
        transparentWhite: '#ffffffde',
        accessibleDarkGrey: '#9b9b9b',
    },
    spacing: {
        paddingContainer: '5em',
        paddingXlarge: '5em',
        paddingLarge: '4em',
        paddingMed: '3em',
        paddingSmall: '2em',
        paddingMini: '1em',
        gapSmall: '1em',
        gapMed: '2em',
        gapLarge: '5em',
        gapXlarge: '6em',
        gapMini: '0.5em',
    },
    borderRadius: {
        small: '1em',
        medium: '3em',
        large: '6.25em',
    },
    fontWeight: {
        normal: 400,
        medium: 500,
        bold: 600,
    },
};
