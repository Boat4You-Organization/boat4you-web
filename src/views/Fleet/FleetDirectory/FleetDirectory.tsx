import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { FleetEntry, FleetPage, fleetPagePath } from '@/utils/static/fleetIndex';

import styles from './FleetDirectory.module.scss';

interface FleetGroup {
  base: string;
  entries: FleetEntry[];
}

/**
 * Server-rendered A-Z directory of the whole promoted catalogue.
 *
 * Deliberately plain markup (no MUI, no client state): every boat has to be
 * a real `<a href="/boat/…">` in the HTML a crawler receives on a
 * parameter-free request, and 300 rows of hydrated components would be a
 * pointless payload on a page whose only job is links.
 */
const FleetDirectory = async ({ slice }: { slice: FleetPage }) => {
  const t = await getTranslations('metadata.fleet');

  // Headings restart on every page — the home base is the single most
  // useful thing to scan a charter fleet by, and it keeps each page's
  // visible copy distinct from its siblings.
  const groups: FleetGroup[] = [];

  slice.entries.forEach(entry => {
    const last = groups[groups.length - 1];

    if (last && last.base === entry.base) {
      last.entries.push(entry);

      return;
    }

    groups.push({ base: entry.base, entries: [entry] });
  });

  const pageNumbers = Array.from({ length: slice.totalPages }, (_, index) => index + 1);

  return (
    <section className={styles.root}>
      <h1 className={styles.title}>{t('heading')}</h1>
      <p className={styles.lede}>{t('lede')}</p>
      <p className={styles.summary}>
        {t('summary', {
          total: slice.totalBoats,
          page: String(slice.pageNumber),
          pages: String(slice.totalPages),
        })}
      </p>

      {groups.map(group => (
        <div key={`${slice.pageNumber}-${group.base}`} className={styles.group}>
          <h2 className={styles.groupTitle}>{group.base || t('otherBases')}</h2>
          <ul className={styles.list}>
            {group.entries.map(entry => {
              const specs = [
                entry.buildYear ? String(entry.buildYear) : null,
                entry.cabins ? t('cabins', { count: entry.cabins }) : null,
                entry.maxPersons ? t('guests', { count: entry.maxPersons }) : null,
              ]
                .filter(Boolean)
                .join(' · ');

              return (
                <li key={entry.slug} className={styles.row}>
                  <Link href={`/boat/${entry.slug}`} className={styles.link}>
                    <span className={styles.model}>{entry.modelName}</span>
                    <span className={styles.name}>{entry.name}</span>
                    {specs && <span className={styles.specs}>{specs}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {slice.totalPages > 1 && (
        <nav aria-label={t('paginationLabel')} className={styles.pagination}>
          {pageNumbers.map(number =>
            number === slice.pageNumber ? (
              <span key={number} aria-current="page" className={styles.pageCurrent}>
                {number}
              </span>
            ) : (
              <Link
                key={number}
                href={fleetPagePath(number)}
                className={styles.pageLink}
                {...(number === slice.pageNumber - 1 ? { rel: 'prev' } : {})}
                {...(number === slice.pageNumber + 1 ? { rel: 'next' } : {})}
              >
                {number}
              </Link>
            )
          )}
        </nav>
      )}
    </section>
  );
};

export default FleetDirectory;
