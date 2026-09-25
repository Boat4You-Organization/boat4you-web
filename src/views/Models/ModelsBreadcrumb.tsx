import { Link } from '@/i18n/navigation';

import styles from './Models.module.scss';

export interface Crumb {
  name: string;
  /** Locale-less path; the last crumb is the current page and is not linked. */
  href?: string;
}

/** Visible breadcrumb; the BreadcrumbList JSON-LD of the page uses the same items. */
const ModelsBreadcrumb = ({ items, label }: { items: Crumb[]; label: string }) => (
  <nav aria-label={label} className={styles.breadcrumb}>
    <ol>
      {items.map((crumb, i) => {
        const isLast = i === items.length - 1;

        return (
          <li key={`${crumb.name}-${crumb.href ?? 'current'}`}>
            {crumb.href && !isLast ? (
              <Link href={crumb.href} prefetch={false} className={styles.crumbLink}>
                {crumb.name}
              </Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined}>{crumb.name}</span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default ModelsBreadcrumb;
