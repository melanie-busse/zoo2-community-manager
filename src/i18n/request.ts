import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

const namespaces = [
    'animal',
    'biome',
    'specialCoat',
    'contest',
    'navigation',
    'page',
    'common',
    'api',
] as const;

export default getRequestConfig(async ({requestLocale}) => {
    let locale = await requestLocale;

    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    const messages: Record<string, unknown> = {};
    for (const ns of namespaces) {
        messages[ns] = (await import(`../../messages/${locale}/${ns}.json`)).default;
    }

    return {
        locale,
        messages,
    };
});