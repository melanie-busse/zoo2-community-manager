import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['de', 'en', 'da', 'nl', 'es', 'fr'],
    defaultLocale: 'de'
});

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);